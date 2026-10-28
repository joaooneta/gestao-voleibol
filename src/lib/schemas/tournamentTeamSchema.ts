import z from "zod";
import { TournamentTeamStatus } from "../../../generated/prisma/enums";

export const requestTournamentEntrySchema = z.object({
  tournamentId: z.string().min(1, "Tournament ID invalido"),
  teamId: z.string().min(1, "Team ID invalido"),
});

export const handleTournamentSubscriptionSchema = z.object({
  tournamentId: z.string().min(1, "Tournament ID invalido"),
  teamId: z.string().min(1, "Team ID invalido"),
  status: z.enum(TournamentTeamStatus),
});

export type RequestTournamentEntrySchema = z.infer<
  typeof requestTournamentEntrySchema
>;

export type HandleTournamentSubscriptionSchema = z.infer<
  typeof handleTournamentSubscriptionSchema
>;
