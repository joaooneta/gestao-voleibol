import { z } from "zod";

export const createTournamentSchema = z.object({
  name: z.string().min(1, { message: "Nome do torneio e obrigatorio" }),
});

export const startTournamentSchema = z.object({
  tournamentId: z.string().min(1, "Tournament ID e obrigatorio"),
});

export type CreateTournamentSchema = z.infer<typeof createTournamentSchema>;
export type StartTournament = z.infer<typeof startTournamentSchema>;
