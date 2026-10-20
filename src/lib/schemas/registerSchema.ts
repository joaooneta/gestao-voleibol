import z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, { error: "Nome é obrigatório" }),
    email: z.email({ error: "Email invalido" }),
    password: z.string().min(8, {
      error: "Senha deve ter no minimo 8 caracteres",
    }),
    confirmPassword: z.string(),
    role: z.enum(["team", "competition"]),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Senhas devem ser combinar",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
