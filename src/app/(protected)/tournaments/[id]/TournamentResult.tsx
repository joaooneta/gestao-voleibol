import { Card, CardContent } from "@heroui/react";
import { Prisma } from "../../../../../generated/prisma/browser";

type TournamentWithTeamsAndMatches = Prisma.TournamentGetPayload<{
  include: {
    tournamentTeams: {
      include: {
        team: true;
      };
    };
    matches: true;
  };
}>;

type TournamentResultProps = {
  tournament: TournamentWithTeamsAndMatches;
};

export default function TournamentResult({
  tournament,
}: TournamentResultProps) {
  const finalMatch = tournament.matches.find((m) => m.stage === "FINAL");

  const championRelation = finalMatch?.winnerId
    ? tournament.tournamentTeams.find((tt) => tt.teamId === finalMatch.winnerId)
    : null;

  const championTeam = championRelation?.team;

  console.log(championTeam);
  return (
    <div className="max-w-50 mx-auto">
      <Card className="h-full text-center max-w-sm">
        <CardContent className="flex flex-1 flex-col gap-2 p-4">
          <p>Equipe Vencedora:</p>
          <h3 className="text-3xl font-semibold">{championTeam?.name}</h3>
        </CardContent>
      </Card>
    </div>
  );
}
