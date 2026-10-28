"use client";

import { CreateTeamSchema, createTeamSchema } from "@/lib/schemas/teamSchema";
import { createTeam } from "@/server/actions/team";
import { Button, FieldError, Input, TextField, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

export default function TeamForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateTeamSchema) => {
    try {
      const result = await createTeam(data);

      if (!result.success) {
        toast.danger("Erro ao criar equipe", { description: result.error });
        return;
      }

      toast.success("Equipe criada com sucesso");
      reset();
    } catch {
      toast.danger("Erro ao criar equipe");
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
              <Input ref={field.ref} placeholder="Nome da Equipe" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        <Button type="submit" isPending={isSubmitting}>
          Criar
        </Button>
      </form>
    </div>
  );
}
