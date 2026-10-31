"use client";

import {
  ConfiguringTournamentSchema,
  configuringTournamentSchema,
} from "@/lib/schemas/tournamentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FieldError,
  Input,
  TextField,
  toast,
  Select,
  ListBox,
} from "@heroui/react";
import { TournamentGender } from "../../../../../generated/prisma/enums";
import { Prisma } from "../../../../../generated/prisma/browser";
import { configureTournament } from "@/server/actions/tournament";

type TournamentWithTeamsAndMatches = Prisma.TournamentGetPayload<{
  include: {
    tournamentTeams: {
      include: {
        team: true;
      };
    };
    matches: true;
  };
}>;

type TournamentConfigurationFormProps = {
  tournament: TournamentWithTeamsAndMatches;
};

export default function TournamentConfigurationForm({
  tournament,
}: TournamentConfigurationFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(configuringTournamentSchema),
    defaultValues: {
      minPlayers: "",
      maxPlayers: "",
      minAge: "",
      maxAge: "",
      gender: TournamentGender.MALE,
    },
  });

  const onSubmit = async (data: ConfiguringTournamentSchema) => {
    try {
      const result = await configureTournament(data, tournament.id);
    } catch (error) {}
  };

  return (
    <div>
      <h2 className="text-3xl text-center">Configurando o Torneio</h2>

      <form
        className="flex flex-col gap-5 justify-center items-center p-5 w-sm mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="minPlayers"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              aria-label="minPlayers"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                trigger(["minPlayers", "maxPlayers"]);
              }}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              className={"w-full"}
            >
              <Input
                ref={field.ref}
                type="number"
                placeholder="Jogadores Minimos"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="maxPlayers"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              aria-label="maxPlayers"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                trigger(["minPlayers", "maxPlayers"]);
              }}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              className={"w-full"}
            >
              <Input
                ref={field.ref}
                type="number"
                placeholder="Jogadores Minimos"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="minAge"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              aria-label="minAge"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                trigger(["minAge", "maxAge"]);
              }}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              className={"w-full"}
            >
              <Input ref={field.ref} type="number" placeholder="Idade minima" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="maxAge"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              aria-label="maxAge"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                trigger(["minAge", "maxAge"]);
              }}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              className={"w-full"}
            >
              <Input ref={field.ref} type="number" placeholder="Idade maxima" />
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
              placeholder="Selecione o Genero"
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
                  <ListBox.Item id="MIXED" textValue="Misto">
                    Misto
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>

              <FieldError>{fieldState.error?.message}</FieldError>
            </Select>
          )}
        />

        <Button type="submit" isPending={isSubmitting}>
          Configurar
        </Button>
      </form>
    </div>
  );
}
