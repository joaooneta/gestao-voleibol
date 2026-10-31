"use client";

import {
  CreateAthleteSchema,
  createAthleteSchema,
} from "@/lib/schemas/athleteSchema";
import { createAthlete } from "@/server/actions/athlete";
import {
  Button,
  FieldError,
  Input,
  TextField,
  toast,
  Select,
  ListBox,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

export default function TeamForm({ teamId }: { teamId: string }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createAthleteSchema),
    defaultValues: {
      name: "",
      cpf: "",
      rg: "",
      age: "",
      gender: undefined,
      position: undefined,
    },
  });

  const onSubmit = async (data: CreateAthleteSchema) => {
    try {
      const result = await createAthlete(data, teamId);

      if (!result.success) {
        toast.danger("Erro ao criar atleta", { description: result.error });
        return;
      }

      toast.success("Atleta criado com sucesso");
      reset();
    } catch {
      toast.danger("Erro ao criar atleta");
    }
  };

  return (
    <div>
      <form
        className="flex flex-col gap-5 justify-center items-center p-5 w-sm mx-auto"
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
              className={"w-full"}
            >
              <Input ref={field.ref} placeholder="Nome completo" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="cpf"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              aria-label="cpf"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              className={"w-full"}
            >
              <Input ref={field.ref} placeholder="CPF" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="rg"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              aria-label="rg"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              className={"w-full"}
            >
              <Input ref={field.ref} placeholder="RG" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="age"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              aria-label="age"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              className={"w-full"}
            >
              <Input ref={field.ref} type="number" placeholder="Idade" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="gender"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              aria-label="Genero"
              placeholder="Selecione o genero"
              value={field.value || null}
              onChange={(value) => field.onChange(value ?? "")}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              className={"w-full"}
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>

              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="MALE" textValue="Masculino">
                    Masculino
                  </ListBox.Item>
                  <ListBox.Item id="FEMALE" textValue="Feminino">
                    Feminino
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>

              <FieldError>{fieldState.error?.message}</FieldError>
            </Select>
          )}
        />

        <Controller
          name="position"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              aria-label="Posição"
              placeholder="Selecione a posição"
              value={field.value || null}
              onChange={(value) => field.onChange(value ?? "")}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              className={"w-full"}
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>

              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="SETTER" textValue="Levantador">
                    Levantador
                  </ListBox.Item>
                  <ListBox.Item id="OPPOSITE" textValue="Oposto">
                    Oposto
                  </ListBox.Item>
                  <ListBox.Item id="OUTSIDE_HITTER" textValue="Ponteiro">
                    Ponteiro
                  </ListBox.Item>
                  <ListBox.Item id="MIDDLE_BLOCKER" textValue="Central">
                    Central
                  </ListBox.Item>
                  <ListBox.Item id="LIBERO" textValue="Líbero">
                    Líbero
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>

              <FieldError>{fieldState.error?.message}</FieldError>
            </Select>
          )}
        />

        <Button type="submit" isPending={isSubmitting}>
          Criar
        </Button>
      </form>
    </div>
  );
}
