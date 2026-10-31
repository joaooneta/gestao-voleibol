"use client";

import { Button, toast } from "@heroui/react";
import { Team } from "../../../../../generated/prisma/client";
import { useState } from "react";
import { requestTournamentEntry } from "@/server/actions/tournament-team";
import TournamentInfoModal from "./TournamentInfoModal";
import { Tournament } from "../../../../../generated/prisma/browser";

type TournamentCardProps = {
  id: string;
  name: string;
  team: Team;
  tournament: Tournament;
};

export default function SubscribeTournamentCard({
  id,
  name,
  team,
  tournament,
}: TournamentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

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

      <div className="flex gap-5">
        <Button variant="outline" onClick={handleModalOpen}>
          Informações
        </Button>

        <Button onClick={handleSubscribe} isPending={isSubscribing}>
          Se inscrever
        </Button>
      </div>

      <TournamentInfoModal
        tournament={tournament}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
