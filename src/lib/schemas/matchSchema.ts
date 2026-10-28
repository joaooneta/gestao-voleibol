import z from "zod";

export const registerMatchWinnerSchema = z.object({
  matchId: z.string().min(1, "ID da partida invalido"),
  tournamentId: z.string().min(1, "ID do torneio invalido"),
  teamAScore: z.coerce
    .number({ message: "Placar Invalido" })
    .min(0, "O placar não pode ser negativo"),
  teamBScore: z.coerce
    .number({ message: "Placar inválido" })
    .min(0, "O placar não pode ser negativo"),
});

export const insertMatchResultSchema = z
  .object({
    teamAScore: z.coerce
      .number({ message: "Placar invalido" })
      .int("Placar invalido")
      .min(25, "O placar dever ter no minimo 25 pontos"),
    teamBScore: z.coerce
      .number({ message: "Placar invalido" })
      .int("Placar invalido")
      .min(25, "O placar dever ter no minimo 25 pontos"),
  })
  .superRefine(({ teamAScore, teamBScore }, ctx) => {
    if (teamAScore === teamBScore) {
      ctx.addIssue({
        code: "custom",
        message: "Nao pode haver impate em mata-mata",
        path: ["teamAScore"],
      });
    }
  });

export type InsertMatchResultSchema = z.infer<typeof insertMatchResultSchema>;
