import z from "zod";

export const createTeamSchema = z.object({
  name: z
    .string({ error: "Nome invalido" })
    .trim()
    .min(1, { error: "Nome é obrigatorio" }),
});

export const deleteTeamSchema = z.object({
  id: z.string().min(1, "ID invalido"),
});

export type CreateTeamSchema = z.infer<typeof createTeamSchema>;
