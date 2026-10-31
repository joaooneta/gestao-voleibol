"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  configuringTournamentSchema,
  createTournamentSchema,
  startTournamentSchema,
} from "@/lib/schemas/tournamentSchema";
import { generateMatchmaking } from "@/lib/utils";

export async function createTournament(input: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Usuario nao autenticado" };
  }

  if (session.user.role !== "TOURNAMENT_MANAGER") {
    return {
      success: false,
      error: "Apenas gestores de torneio podem criar competicoes",
    };
  }

  const result = createTournamentSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "Nome de torneio invalido",
    };
  }

  await prisma.tournament.create({
    data: {
      name: result.data.name,
      status: "CONFIGURING",
      manager: { connect: { id: session.user.id } },
    },
  });

  revalidatePath("/tournaments");

  return { success: true };
}

export async function configureTournament(
  input: unknown,
  tournamentId: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Usuario nao autenticado" };
  }

  if (session.user.role !== "TOURNAMENT_MANAGER") {
    return {
      success: false,
      error: "Apenas gestores de torneio podem gerir torneios",
    };
  }

  const result = configuringTournamentSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "Dados invalidos",
    };
  }

  const existingTournament = await await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!existingTournament) {
    return {
      success: false,
      error: "Torneio nao existe",
    };
  }

  if (existingTournament.status !== "CONFIGURING") {
    return {
      success: false,
      error: "Fase de configuracao ja foi encerrada",
    };
  }

  const updatedTournament = await prisma.tournament.update({
    where: { id: tournamentId },
    data: { ...result.data, status: "OPEN" },
  });

  revalidatePath(`/tournaments/${tournamentId}`);

  return { success: true };
}

export async function startTournament(input: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Usuario nao autenticado" };
  }

  if (session.user.role !== "TOURNAMENT_MANAGER") {
    return {
      success: false,
      error: "Apenas gestores de torneio podem gerir torneios",
    };
  }

  const result = startTournamentSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "O id do torneio e obrigatorio",
    };
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: result.data.tournamentId },
  });

  if (!tournament || tournament.status !== "OPEN") {
    return {
      success: false,
      error: "Torneio invalido ou nao esta em fase de inscricao",
    };
  }

  const acceptedTeams = await prisma.tournamentTeam.findMany({
    where: {
      tournamentId: result.data.tournamentId,
      status: "ACCEPTED",
    },
  });

  const totalTeams = acceptedTeams.length;

  if (totalTeams !== 8) {
    return {
      success: false,
      error: "Sao necessarios 8 times para iniciar um torneio neste regime",
    };
  }

  const acceptedTeamsIds = acceptedTeams.map((team) => team.teamId);

  const matchesToCreate = generateMatchmaking(
    acceptedTeamsIds,
    result.data.tournamentId,
    "QUARTER_FINALS",
  );

  await prisma.$transaction([
    prisma.match.createMany({
      data: matchesToCreate,
    }),

    prisma.tournament.update({
      where: { id: result.data.tournamentId },
      data: { status: "IN_PROGRESS" },
    }),
  ]);

  /*
  const acceptedTeamsIds = acceptedTeams.map((team) => team.teamId);
  const shuffledTeamsIds = [...acceptedTeamsIds].sort(
    () => Math.random() - 0.5,
  );

  await prisma.$transaction([
    prisma.match.createMany({
      data: [
        {
          tournamentId: result.data.tournamentId,
          stage: "QUARTER_FINALS",
          teamAId: shuffledTeamsIds[0],
          teamBId: shuffledTeamsIds[1],
        },

        {
          tournamentId: result.data.tournamentId,
          stage: "QUARTER_FINALS",
          teamAId: shuffledTeamsIds[2],
          teamBId: shuffledTeamsIds[3],
        },

        {
          tournamentId: result.data.tournamentId,
          stage: "QUARTER_FINALS",
          teamAId: shuffledTeamsIds[4],
          teamBId: shuffledTeamsIds[5],
        },

        {
          tournamentId: result.data.tournamentId,
          stage: "QUARTER_FINALS",
          teamAId: shuffledTeamsIds[6],
          teamBId: shuffledTeamsIds[7],
        },
      ],
    }),
        prisma.tournament.update({
      where: { id: result.data.tournamentId },
      data: { status: "IN_PROGRESS" },
    }),
  ]);
  */

  revalidatePath(`/tournaments/${result.data.tournamentId}`);
  return { success: true };
}

/*
async function getCurrentTournamentStage(tournamentId: string) {
  const matches = await prisma.match.findMany({
    where: { tournamentId },
  });

  const hasSemis = matches.some((m) => m.stage === "SEMI_FINALS");
  const hasFinals = matches.some((m) => m.stage === "FINAL");

  if (hasFinals) return "FINALS";
  if (hasSemis) return "SEMI_FINALS";
  return "QUARTER_FINALS";
}
*/
