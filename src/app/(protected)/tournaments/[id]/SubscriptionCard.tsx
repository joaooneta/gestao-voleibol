"use client";

import { Button, toast } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import { TournamentTeamStatus } from "../../../../../generated/prisma/enums";
import { handleTournamentSubscription } from "@/server/actions/tournament-team";

type SubscriptionCardProps = {
  tournamentId: string;
  teamId: string;
  name: string;
  status: TournamentTeamStatus;
};

export default function SubscriptionCard({
  tournamentId,
  teamId,
  name,
  status,
}: SubscriptionCardProps) {
  const [isHandlingSubscription, setIsHandlingSubscription] = useState(false);

  const handleSubscription = async (status: "ACCEPTED" | "REJECTED") => {
    setIsHandlingSubscription(true);

    try {
      const result = await handleTournamentSubscription({
        tournamentId,
        teamId,
        status,
      });

      if (!result.success) {
        toast.danger("Erro ao gerenciar inscricao", {
          description: result.error,
        });
        setIsHandlingSubscription(false);
        return;
      }

      toast.success("Inscricao gerenciada com sucesso");
    } catch (error) {
      toast.danger("Erro gerenciar inscricao");
      setIsHandlingSubscription(false);
    }

    setIsHandlingSubscription(false);
  };

  return (
    <div className="bg-white rounded p-5 flex justify-between w-full">
      <p>{name}</p>

      {status === "ACCEPTED" && <p>ACEITA</p>}

      {status === "REJECTED" && <p>REJEITADA</p>}

      {status === "PENDING" && (
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => handleSubscription("ACCEPTED")}
            isPending={isHandlingSubscription}
          >
            Aceitar
          </Button>
          <Button
            variant="danger"
            onClick={() => handleSubscription("REJECTED")}
            isPending={isHandlingSubscription}
          >
            Rejeitar
          </Button>
        </div>
      )}
    </div>
  );
}
