"use client";

import { Button, toast } from "@heroui/react";
import { Prisma } from "../../../../../generated/prisma/client";
import SubscriptionCard from "./SubscriptionCard";
import { useState } from "react";
import { startTournament } from "@/server/actions/tournament";

type TournamentWithTeams = Prisma.TournamentGetPayload<{
  include: {
    tournamentTeams: {
      include: {
        team: true;
      };
    };
  };
}>;

type ManageSubscriptionProps = {
  tournament: TournamentWithTeams;
};

export default function ManageSubscription({
  tournament,
}: ManageSubscriptionProps) {
  const [isStartingTournament, setIsStartingTournament] = useState(false);

  const acceptedTeams = tournament.tournamentTeams.filter(
    (team) => team.status === "ACCEPTED",
  );

  const handleStartTournament = async () => {
    setIsStartingTournament(true);

    try {
      console.log(tournament.id);
      const result = await startTournament({ tournamentId: tournament.id });

      if (!result.success) {
        toast.danger("Erro ao iniciar torneio", { description: result.error });
        setIsStartingTournament(false);
        return;
      }

      toast.success("Torneio iniciado com sucesso");
    } catch (error) {
      toast.danger("Erro ao iniciar torneio");
      setIsStartingTournament(false);
    }

    setIsStartingTournament(false);
  };

  return (
    <>
      <h2 className="text-3xl text-center mb-5">{tournament.name}</h2>

      <h3 className="text-2xl text-center mb-5">
        {acceptedTeams.length} times aprovados
      </h3>

      <div className="flex justify-center gap-3">
        <h2 className="text-2xl text-center">Inscrições Pendentes</h2>
        <Button
          onClick={handleStartTournament}
          isPending={isStartingTournament}
        >
          Iniciar Torneio
        </Button>
      </div>

      {/* <div>
        <TeamForm />
      </div>*/}

      <div className="flex flex-col gap-5 p-5">
        {tournament.tournamentTeams.map((subscription) => (
          <SubscriptionCard
            key={subscription.team.id}
            tournamentId={tournament.id}
            teamId={subscription.team.id}
            name={subscription.team.name}
            status={subscription.status}
          />
        ))}
      </div>
    </>
  );
}
