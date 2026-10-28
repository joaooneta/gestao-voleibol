"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createTeamSchema, deleteTeamSchema } from "@/lib/schemas/teamSchema";

export async function createTeam(input: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Usuario nao autenticado" };
  }

  const result = createTeamSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "Nome de time invalido",
    };
  }

  if (session.user.role !== "TEAM_MANAGER") {
    return {
      success: false,
      error: "Apenas gestores de equipes podem criar equipes",
    };
  }

  await prisma.team.create({
    data: {
      name: result.data.name,
      trainer: { connect: { id: session.user.id } },
    },
  });

  revalidatePath("/teams");

  return { success: true };
}

export async function deleteTeam(input: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Usuario nao autenticado" };
  }

  const result = deleteTeamSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "ID do time invalido",
    };
  }

  const team = await prisma.team.findFirst({
    where: {
      id: result.data.id,
      trainerId: session.user.id,
    },

    select: { id: true },
  });

  if (!team) {
    return {
      success: false,
      error: "Time nao existe ou nao te pertence",
    };
  }

  await prisma.team.delete({ where: { id: team.id } });

  revalidatePath("/teams");

  return { success: true };
}
