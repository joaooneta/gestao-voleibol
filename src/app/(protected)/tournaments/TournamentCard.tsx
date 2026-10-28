import { Button } from "@heroui/react";
import { TournamentStatus } from "../../../../generated/prisma/enums";
import Link from "next/link";

type TournamentCardProps = {
  id: string;
  name: string;
  status: TournamentStatus;
};

const statusLabels = {
  OPEN: "Em Aberto",
  IN_PROGRESS: "Em Andamento",
  FINISHED: "Finalizado",
};

export default function TournamentCard({
  id,
  name,
  status,
}: TournamentCardProps) {
  return (
    <div key={id} className="bg-white rounded p-5 flex justify-between w-full">
      <p>
        {name} - {statusLabels[status]}
      </p>

      <Button>
        <Link href={`/tournaments/${id}`}>Gerenciar</Link>
      </Button>
    </div>
  );
}
