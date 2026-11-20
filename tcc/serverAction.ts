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
