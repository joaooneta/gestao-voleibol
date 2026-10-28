import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { i18n, locales } from "@better-auth/i18n";
import { headers } from "next/headers";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      role: {
        type: ["team", "competition"],
        required: true,
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    i18n({
      translations: {
        pt: locales.pt,
      },
    }),

    nextCookies(),
  ],
});

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
}
