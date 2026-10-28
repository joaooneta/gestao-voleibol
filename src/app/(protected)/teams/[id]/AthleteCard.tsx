"use client";

import { deleteAthlete } from "@/server/actions/athlete";
import { Button, Card, CardContent, toast } from "@heroui/react";
import { useState } from "react";

type AthleteCardProps = {
  id: string;
  position: string;
  name: string;
  age: number;
  teamId: string;
};

export default function AthleteCard({
  id,
  position,
  name,
  age,
  teamId,
}: AthleteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAthlete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAthlete({ id }, teamId);

      if (!result.success) {
        toast.danger("Erro ao deletar atleta", { description: result.error });
        return;
      }

      toast.success("Atleta deletado com sucesso");
    } catch {
      toast.danger("Erro ao criar Atleta");
      setIsDeleting(false);
    }

    setIsDeleting(false);
  };

  return (
    <Card className="h-full text-center">
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold">{name}</h3>

        <p>{age} anos</p>

        <p>{position}</p>

        <Button
          className="mt-auto w-full"
          variant="danger"
          onClick={handleDeleteAthlete}
          isPending={isDeleting}
        >
          Deletar
        </Button>
      </CardContent>
    </Card>
  );
}
