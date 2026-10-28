"use client";

import {
  CreateTournamentSchema,
  createTournamentSchema,
} from "@/lib/schemas/tournamentSchema";
import { createTournament } from "@/server/actions/tournament";
import { Button, FieldError, Input, TextField, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function TournamentForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateTournamentSchema) => {
    try {
      const result = await createTournament(data);

      if (!result.success) {
        toast.danger("Erro ao criar torneio", { description: result.error });
        return;
      }

      toast.success("Torneio criado com sucesso");
      reset();
      router.refresh();
    } catch {
      toast.danger("Erro ao criar torneio");
    }
  };

  return (
    <div>
      <form
        className="flex gap-5 w-full justify-center items-center p-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              aria-label="name"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
            >
              <Input ref={field.ref} placeholder="Nome do Torneio" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        <Button type="submit" isPending={isSubmitting}>
          Criar Torneio
        </Button>
      </form>
    </div>
  );
}
