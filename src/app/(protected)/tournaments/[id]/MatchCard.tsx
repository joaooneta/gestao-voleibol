"use client";

import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FieldError,
  Input,
  TextField,
  toast,
  Card,
  CardContent,
} from "@heroui/react";
import { Match } from "../../../../../generated/prisma/browser";
import {} from "@heroui/react";
import {
  insertMatchResultSchema,
  InsertMatchResultSchema,
} from "@/lib/schemas/matchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerMatchWinner } from "@/server/actions/match";

type MatchCardProps = {
  match: Match;
  tournamentId: string;
  teamAName: string;
  teamBName: string;
};

export default function MatchCard({
  match,
  tournamentId,
  teamAName,
  teamBName,
}: MatchCardProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(insertMatchResultSchema),
    defaultValues: {
      teamAScore: 0,
      teamBScore: 0,
    },
  });

  const onSubmit = async (data: InsertMatchResultSchema) => {
    try {
      const result = await registerMatchWinner({
        matchId: match.id,
        tournamentId,
        teamAScore: data.teamAScore,
        teamBScore: data.teamBScore,
      });

      if (!result.success) {
        toast.danger("Erro ao criar atleta", { description: result.error });
        return;
      }
      console.log(data);
    } catch (error) {
      toast.danger("Erro ao inserir Resultado");
    }
  };

  return (
    <Card className="h-full text-center">
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex justify-between font-semibold">
          <p>{teamAName}</p>
          vs.
          <p>{teamBName}</p>
        </div>

        <div>
          <form
            className="flex flex-col gap-5 w-full justify-center items-center p-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="teamAScore"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  aria-label="teamAScore"
                  value={String(field.value ?? "")}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={fieldState.invalid}
                >
                  <Input ref={field.ref} placeholder={`Pontos ${teamAName}`} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />

            <Controller
              name="teamBScore"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  aria-label="teamBScore"
                  value={String(field.value ?? "")}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={fieldState.invalid}
                >
                  <Input
                    ref={field.ref}
                    type="number"
                    placeholder={`Pontos ${teamBName}`}
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />

            <Button type="submit" isPending={isSubmitting}>
              Inserir Resultado
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
