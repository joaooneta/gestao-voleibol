"use client";

import { authClient } from "@/lib/auth-client";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  FieldError,
  Form,
  Input,
  Link,
  TextField,
  toast,
} from "@heroui/react";
import { Label, Radio, RadioGroup } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "team",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onSuccess: () => {
          router.push("/teams");
          router.refresh();
        },

        onError: (ctx) => {
          toast.danger(ctx.error.message);
        },
      },
    );
  };

  return (
    <Card className="min-w-sm flex items-center justify-center shadow-2xl">
      <CardHeader>
        <div>
          <h2 className="text-3xl">Registrar</h2>
        </div>
      </CardHeader>

      <form
        className="flex flex-col gap-5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField defaultValue="" aria-label="name" isInvalid={!!errors.name}>
          <Input placeholder="Nome Completo" {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </TextField>

        <TextField
          defaultValue=""
          aria-label="email"
          isInvalid={!!errors.email}
        >
          <Input placeholder="usuario@email.com" {...register("email")} />
          <FieldError>{errors.email?.message}</FieldError>
        </TextField>

        <TextField
          defaultValue=""
          aria-label="password"
          type="password"
          isInvalid={!!errors.password}
        >
          <Input placeholder="********" {...register("password")} />
          <FieldError>{errors.password?.message}</FieldError>
        </TextField>

        <TextField
          defaultValue=""
          aria-label="confirmPassword"
          type="password"
          isInvalid={!!errors.confirmPassword}
        >
          <Input placeholder="********" {...register("confirmPassword")} />
          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </TextField>

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              aria-label="role"
              name={field.name}
              className="w-full"
            >
              <Label>Selecionar Função</Label>
              <Radio value="team" className="flex">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  Gestor de Equipe
                </Radio.Content>
              </Radio>

              <Radio value="competition">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  Gestor de Torneio
                </Radio.Content>
              </Radio>
            </RadioGroup>
          )}
        />

        <Button isPending={isSubmitting} type="submit" className="w-full">
          Registrar
        </Button>
      </form>

      <CardFooter className="flex gap-2">
        Já tem uma conta?
        <Link href={"/login"} className="text-xl text-blue-500">
          Logar
        </Link>
      </CardFooter>
    </Card>
  );
}
