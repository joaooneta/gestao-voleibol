"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  handleTournamentSubscriptionSchema,
  requestTournamentEntrySchema,
} from "@/lib/schemas/tournamentTeamSchema";
import { TournamentTeamStatus } from "../../../generated/prisma/enums";

export async function requestTournamentEntry(input: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Usuario nao autenticado" };
  }

  const result = requestTournamentEntrySchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "IDs invalidos",
    };
  }

  if (session.user.role !== "TEAM_MANAGER") {
    return {
      success: false,
      error: "Apenas gestores de equipes podem se inscrever em torneios",
    };
  }

  const { tournamentId, teamId } = result.data;

  const alreadySubscribed = await prisma.tournamentTeam.findUnique({
    where: {
      tournamentId_teamId: { tournamentId, teamId },
    },
    select: { id: true },
  });

  if (alreadySubscribed) {
    return {
      success: false,
      error: "Voce ja tem uma solicitacao pendente",
    };
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { status: true },
  });

  if (!tournament || tournament.status !== "OPEN") {
    return {
      success: false,
      error: "Este torneio nao esta aceitando solicitacoes",
    };
  }

  await prisma.tournamentTeam.create({
    data: {
      tournamentId,
      teamId,
      status: TournamentTeamStatus.PENDING,
    },
  });

  revalidatePath("/explore/tournaments");

  return { success: true };
}

export async function handleTournamentSubscription(input: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Usuario nao autenticado" };
  }

  const result = handleTournamentSubscriptionSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "IDs invalidos",
    };
  }

  if (session.user.role !== "TOURNAMENT_MANAGER") {
    return {
      success: false,
      error: "Apenas gestores de torneios podem resolver inscricoes",
    };
  }

  const { tournamentId, teamId, status } = result.data;

  const subscription = await prisma.tournamentTeam.findUnique({
    where: {
      tournamentId_teamId: { tournamentId, teamId },
    },
    select: { id: true },
  });

  if (!subscription) {
    return {
      success: false,
      error: "Inscricao nao existe",
    };
  }

  await prisma.tournamentTeam.update({
    where: {
      tournamentId_teamId: { tournamentId, teamId },
    },
    data: { status },
  });

  revalidatePath("/explore/tournaments");
  return { success: true };
}
