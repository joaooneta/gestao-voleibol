"use client";

import { authClient } from "@/lib/auth-client";
import { LoginSchema, loginSchema } from "@/lib/schemas/loginSchema";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  FieldError,
  Link,
  Input,
  TextField,
  toast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (ctx) => {
          const userRole = ctx.data.user.role;

          if (userRole === "TEAM_MANAGER") router.push("/teams");
          if (userRole === "TOURNAMENT_MANAGER") router.push("/tournaments");

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
          <h2 className="text-3xl">Logar</h2>
        </div>
      </CardHeader>

      <form
        className="flex flex-col gap-5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
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

        <Button isPending={isSubmitting} type="submit" className="w-full">
          Logar
        </Button>
      </form>

      <CardFooter className="flex gap-2">
        Não tem uma conta?
        <Link href={"/register"} className="text-xl text-blue-500">
          Registrar
        </Link>
      </CardFooter>
    </Card>
  );
}
