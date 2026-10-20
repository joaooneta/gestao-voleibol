import z from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Email invalido" }),
  password: z.string().min(8, {
    error: "Senha deve ter no minimo 8 caracteres",
  }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
