"use client";

import { Button, toast } from "@heroui/react";
import { Team } from "../../../../../generated/prisma/client";
import { useState } from "react";
import { requestTournamentEntry } from "@/server/actions/tournament-team";

type TournamentCardProps = {
  id: string;
  name: string;
  team: Team;
};

export default function SubscribeTournamentCard({
  id,
  name,
  team,
}: TournamentCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    setIsSubscribing(true);

    try {
      const result = await requestTournamentEntry({
        tournamentId: id,
        teamId: team.id,
      });

      if (!result.success) {
        toast.danger("Erro ao realizar inscricao", {
          description: result.error,
        });
        setIsSubscribing(false);
        return;
      }

      toast.success("Equipe inscrita com sucesso");
    } catch (error) {
      toast.danger("Erro ao realizar inscricao");
      setIsSubscribing(false);
    }

    setIsSubscribing(false);
  };

  return (
    <div
      key={id}
      className="bg-white rounded p-5 flex justify-between w-full flex gap-5"
    >
      <p>{name}</p>

      <Button onClick={handleSubscribe} isPending={isSubscribing}>
        Se inscrever
      </Button>
    </div>
  );
}
