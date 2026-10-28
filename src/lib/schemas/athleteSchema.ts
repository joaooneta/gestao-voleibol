import z from "zod";
import { VolleyballPosition } from "@/../generated/prisma/enums";

function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += Number(digits[i]) * (10 - i);
  }

  let remainder = (sum * 10) % 11;
  const firstDigit = remainder === 10 ? 0 : remainder;

  if (firstDigit !== Number(digits[9])) return false;

  sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += Number(digits[i]) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  const secondDigit = remainder === 10 ? 0 : remainder;

  return secondDigit === Number(digits[10]);
}

export const createAthleteSchema = z.object({
  name: z.string().trim().min(1, { error: "Nome é obrigatorio" }),

  cpf: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .refine(isValidCPF, "CPF invalido"),

  rg: z
    .string()
    .trim()
    .min(5, "O RG deve ter pelo menos 5 caracteres")
    .max(20, "O RG deve ter no maximo 20 caracteres")
    .regex(/^[0-9]/, "RG invalido"),

  age: z.coerce
    .number<string>()
    .int("Idade invalida")
    .min(1, "Minimo de 1 ano")
    .max(120, "Maximo de 120 anos"),

  position: z.enum(VolleyballPosition, {
    error: "Posicao invalida.",
  }),
});

export const deleteAthleteSchema = z.object({
  id: z.string().min(1, "ID invalido"),
});

export type CreateAthleteSchema = z.infer<typeof createAthleteSchema>;
