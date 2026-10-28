"use client";

import { Button, toast } from "@heroui/react";

import { deleteTeam } from "@/server/actions/team";
import Link from "next/link";
import { useState } from "react";

type TeamCardProps = {
  id: string;
  name: string;
};

export default function TeamCard({ id, name }: TeamCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTeam = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTeam({ id });

      if (!result.success) {
        toast.danger("Erro ao deletar equipe", { description: result.error });
        return;
      }

      toast.success("Equipe deletada com sucesso");
    } catch {
      toast.danger("Erro ao criar equipe");
      setIsDeleting(false);
    }

    setIsDeleting(false);
  };

  return (
    <div key={id} className="bg-white rounded p-5 flex justify-between w-full">
      <p>{name}</p>

      <div className="flex gap-3">
        <Button>
          <Link href={`/teams/${id}`}>Inserir Jogadores</Link>
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteTeam}
          isPending={isDeleting}
        >
          Deletar
        </Button>
      </div>
    </div>
  );
}
