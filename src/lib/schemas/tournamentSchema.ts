import { z } from "zod";
import { TournamentGender } from "../../../generated/prisma/enums";

export const createTournamentSchema = z.object({
  name: z.string().min(1, { message: "Nome do torneio e obrigatorio" }),
});

export const configuringTournamentSchema = z
  .object({
    minPlayers: z.coerce
      .number<string>()
      .int("Jogadores minimos invalida")
      .min(2, "Minimo de 2 jogadores")
      .max(11, "Maximo de 11 jogadores"),
    maxPlayers: z.coerce
      .number<string>()
      .int("Jogadores maximos invalido")
      .min(2, "Minimo de 2 jogadores")
      .max(11, "Maximo de 12 jogadores"),

    minAge: z.coerce
      .number<string>()
      .int("Idade minima invalida")
      .min(1, "Minimo de 1 ano")
      .max(120, "Maximo de 120 anos"),
    maxAge: z.coerce
      .number<string>()
      .int("Idade maxima invalida")
      .min(1, "Minimo de 1 ano")
      .max(120, "Maximo de 120 anos"),

    gender: z.enum(TournamentGender, {
      message: "Genero invalido",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.minPlayers > data.maxPlayers) {
      ctx.addIssue({
        code: "custom",
        message: "Minimo nao pode ser maior que o maximo",
        path: ["minPlayers"],
      });

      ctx.addIssue({
        code: "custom",
        message: "Maximo nao pode ser menor que o minimo",
        path: ["maxPlayers"],
      });
    }

    if (data.minAge > data.maxAge) {
      ctx.addIssue({
        code: "custom",
        message: "Idade minima nao pode ser maior que a maxima",
        path: ["minAge"],
      });

      ctx.addIssue({
        code: "custom",
        message: "Idade maxima nao pode ser menor que a minima",
        path: ["maxAge"],
      });
    }
  });

export const startTournamentSchema = z.object({
  tournamentId: z.string().min(1, "Tournament ID e obrigatorio"),
});

export type CreateTournamentSchema = z.infer<typeof createTournamentSchema>;
export type StartTournament = z.infer<typeof startTournamentSchema>;
export type ConfiguringTournamentSchema = z.infer<
  typeof configuringTournamentSchema
>;
