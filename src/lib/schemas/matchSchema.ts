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
      .min(0, "O placar nao pode ser negativo"),
    teamBScore: z.coerce
      .number({ message: "Placar invalido" })
      .int("Placar invalido")
      .min(0, "O placar nao pode ser negativo"),
  })
  .superRefine(({ teamAScore, teamBScore }, ctx) => {
    if (teamAScore === teamBScore) {
      ctx.addIssue({
        code: "custom",
        message: "Nao pode haver impate em mata-mata",
        path: ["teamAScore"],
      });

      return;
    }

    const lowerScore = Math.min(teamAScore, teamBScore);
    const higherScore = Math.max(teamAScore, teamBScore);
    const difference = higherScore - lowerScore;

    if (higherScore < 25) {
      ctx.addIssue({
        code: "custom",
        message: "O vencedor tem que ter pelo menos 25 pontos",
        path: ["teamAScore"],
      });

      return;
    }

    if (difference < 2) {
      ctx.addIssue({
        code: "custom",
        message:
          "Acima de 25 pontos, o vencedor deve ter no minimo 2 pontos de diferenca",
        path: ["teamAScore"],
      });

      return;
    }
  });

export type InsertMatchResultSchema = z.infer<typeof insertMatchResultSchema>;
