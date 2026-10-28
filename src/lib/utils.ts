import { MatchStage } from "../../generated/prisma/enums";

export function generateMatchmaking(
  teamIds: string[],
  tournamentId: string,
  stage: MatchStage,
) {
  const shuffled = [...teamIds].sort(() => Math.random() - 0.5);
  const matchesData = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    matchesData.push({
      tournamentId,
      stage,
      teamAId: shuffled[i],
      teamBId: shuffled[i + 1] ?? null,
    });
  }

  return matchesData;
}
