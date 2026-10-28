"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  createAthleteSchema,
  deleteAthleteSchema,
} from "@/lib/schemas/athleteSchema";

export async function createAthlete(input: unknown, teamId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Usuario nao autenticado" };
  }

  const result = createAthleteSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "Dados Invalidos",
    };
  }

  const cpf = await prisma.athlete.findFirst({
    where: {
      cpf: result.data.cpf,
      teamId: teamId,
    },
  });

  if (cpf) {
    return {
      success: false,
      error: "CPF já utilizado",
    };
  }

  const rg = await prisma.athlete.findFirst({
    where: {
      rg: result.data.rg,
      teamId: teamId,
    },
  });

  if (rg) {
    return {
      success: false,
      error: "RG já utilizado",
    };
  }

  await prisma.athlete.create({
    data: {
      name: result.data.name,
      cpf: result.data.cpf,
      rg: result.data.rg,
      age: result.data.age,
      position: result.data.position,
      team: { connect: { id: teamId } },
    },
  });

  revalidatePath(`/teams/${teamId}`);

  return { success: true };
}

export async function deleteAthlete(input: unknown, teamId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Usuario nao autenticado" };
  }

  const result = deleteAthleteSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "ID do atleta invalido",
    };
  }

  const athlete = await prisma.athlete.findFirst({
    where: {
      id: result.data.id,
      teamId: teamId,
    },

    select: { id: true },
  });

  if (!athlete) {
    return {
      success: false,
      error: "Atleta nao existe ou não pertence ao time",
    };
  }

  await prisma.athlete.delete({ where: { id: athlete.id } });

  revalidatePath(`/teams/${teamId}`);

  return { success: true };
}
