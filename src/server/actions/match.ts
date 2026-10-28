"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { registerMatchWinnerSchema } from "@/lib/schemas/matchSchema";
import { MatchStage } from "../../../generated/prisma/enums";

export async function registerMatchWinner(input: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Usuario nao autenticado" };
  }

  if (session.user.role !== "TOURNAMENT_MANAGER") {
    return {
      success: false,
      error:
        "Apenas gestores de torneio podem registrar resultados de competicoes",
    };
  }

  const result = registerMatchWinnerSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "Dados Invalidos",
    };
  }

  const { matchId, tournamentId, teamAScore, teamBScore } = result.data;

  if (teamAScore === teamBScore) {
    return { success: false, error: "Nao pode haver empate no mata-mata" };
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match || !match.teamAId || !match.teamBId) {
    return { success: false, error: "Partida invalida" };
  }

  const winnerId = teamAScore > teamBScore ? match.teamAId : match.teamBId;

  const updatedMatch = await prisma.match.update({
    where: { id: result.data.matchId },
    data: { teamAScore, teamBScore, winnerId },
  });

  if (updatedMatch.stage === MatchStage.FINAL) {
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: "FINISHED" },
    });

    revalidatePath(`/tournaments/${tournamentId}`);
    return { success: true, message: "Torneio encerrado" };
  }

  const matchesInCurrentStage = await prisma.match.findMany({
    where: {
      tournamentId,
      stage: updatedMatch.stage,
    },
  });

  const allMatchesFinished =
    matchesInCurrentStage.length > 0 &&
    matchesInCurrentStage.every((m) => m.winnerId !== null);

  if (allMatchesFinished) {
    let nextStage: MatchStage | null = null;

    if (updatedMatch.stage === "QUARTER_FINALS") {
      nextStage = "SEMI_FINALS";
    } else if (updatedMatch.stage === "SEMI_FINALS") {
      nextStage = "FINAL";
    }

    if (nextStage) {
      const existingNextStageMatches = await prisma.match.findFirst({
        where: { tournamentId, stage: nextStage as MatchStage },
      });

      if (!existingNextStageMatches) {
        const winners = matchesInCurrentStage.map((m) => m.winnerId);

        if (nextStage === "SEMI_FINALS" && winners.length === 4) {
          await prisma.match.createMany({
            data: [
              {
                tournamentId,
                stage: "SEMI_FINALS",
                teamAId: winners[0],
                teamBId: winners[1],
              },
              {
                tournamentId,
                stage: "SEMI_FINALS",
                teamAId: winners[2],
                teamBId: winners[3],
              },
            ],
          });
        } else if (nextStage === "FINAL" && winners.length === 2) {
          await prisma.match.createMany({
            data: [
              {
                tournamentId,
                stage: "FINAL",
                teamAId: winners[0],
                teamBId: winners[1],
              },
            ],
          });
        }
      }
    }
  }

  revalidatePath(`/tournaments/${result.data.tournamentId}`);
  return { success: true };
}
