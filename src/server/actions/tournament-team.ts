"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  handleTournamentSubscriptionSchema,
  requestTournamentEntrySchema,
} from "@/lib/schemas/tournamentTeamSchema";
import {
  AthleteGender,
  TournamentTeamStatus,
} from "../../../generated/prisma/enums";

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
  });

  if (!tournament) {
    return {
      success: false,
      error: "Torneio nao existe",
    };
  }

  const athletes = await prisma.athlete.findMany({
    where: { teamId: teamId },
  });

  if (!tournament || tournament.status !== "OPEN") {
    return {
      success: false,
      error: "Este torneio nao esta aceitando solicitacoes",
    };
  }

  if (athletes.length === 0) {
    return {
      success: false,
      error: "A equipe nao tem atletas cadastrados",
    };
  }

  if (tournament.minPlayers && athletes.length < tournament.minPlayers) {
    return {
      success: false,
      error: `Voce deve ter no minimo ${tournament.minPlayers} atletas cadastrados`,
    };
  }

  if (tournament.maxPlayers && athletes.length > tournament.maxPlayers) {
    return {
      success: false,
      error: `Voce deve ter no maximo ${tournament.maxPlayers} atletas cadastrados`,
    };
  }

  if (tournament.minAge && tournament.maxAge) {
    const ages = athletes.map((athlete) => athlete.age);

    const minTeamAge = Math.min(...ages);
    const maxTeamAge = Math.max(...ages);

    if (tournament.minAge > minTeamAge) {
      return {
        success: false,
        error: `A idade minima do torneio e ${tournament.minAge}}`,
      };
    }

    if (tournament.maxAge < maxTeamAge) {
      return {
        success: false,
        error: `A idade maxima do torneio e ${tournament.maxAge}}`,
      };
    }
  }

  if (tournament.gender && tournament.gender !== "MIXED") {
    const hasInvalidGender = athletes.some(
      (athlete) => athlete.gender !== tournament.gender,
    );

    const toastGenderText =
      tournament.gender === AthleteGender.MALE ? "masculino" : "feminino";

    if (hasInvalidGender) {
      return {
        success: false,
        error: `Este torneio so aceita atletas do genero ${toastGenderText}`,
      };
    }
  }

  if (tournament.gender && tournament.gender === "MIXED") {
    const hasMale = athletes.some(
      (athlete) => athlete.gender === AthleteGender.MALE,
    );
    const hasFemale = athletes.some(
      (athlete) => athlete.gender === AthleteGender.FEMALE,
    );

    if (!hasMale || !hasFemale) {
      return {
        success: false,
        error: `Este torneio somente aceita equipes com atletas de ambos os generos`,
      };
    }
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
