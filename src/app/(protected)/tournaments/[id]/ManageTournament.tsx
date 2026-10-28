"use client";

import { Match, Prisma } from "../../../../../generated/prisma/browser";
import MatchCard from "./MatchCard";

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

type ManageTournamentProps = {
  tournament: TournamentWithTeamsAndMatches;
};

export default function ManageTournament({
  tournament,
}: ManageTournamentProps) {
  const teamsMap = new Map(
    tournament.tournamentTeams
      .filter((tt) => tt.status === "ACCEPTED")
      .map((tt) => [tt.team.id, tt.team.name]),
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tournament.matches.map((match) => {
        if (match.winnerId) return;

        const teamAName = teamsMap.get(match.teamAId as string)!;
        const teamBName = teamsMap.get(match.teamBId as string)!;

        return (
          <MatchCard
            key={match.id}
            match={match}
            tournamentId={tournament.id}
            teamAName={teamAName}
            teamBName={teamBName}
          />
        );
      })}
    </div>
  );
}
