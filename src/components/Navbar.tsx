"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRole } from "../../generated/prisma/enums";

const teamManagerLinks = [
  { url: "/teams", label: "Criar Times" },
  { url: "/explore/tournaments", label: "Buscar Torneios" },
];

const tournamentManagerLinks = [
  { url: "/tournaments", label: "Criar Torneios" },
];

type NavbarProps = {
  userRole: UserRole;
};

export default function Navbar({ userRole }: NavbarProps) {
  const router = useRouter();

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="p-5 border-b mb-10 bg-accent">
      <div className="flex justify-end items-center gap-3">
        {userRole === "TEAM_MANAGER" && (
          <>
            <Link href={"/teams"} className="text-white">
              Times
            </Link>{" "}
            <Link href={"/explore/tournaments"} className="text-white">
              Buscar Torneios
            </Link>
          </>
        )}

        {userRole === "TOURNAMENT_MANAGER" && (
          <Link href={"/tournaments"} className="text-white">
            Torneios
          </Link>
        )}

        <Button variant="secondary" onClick={logout}>
          Deslogar
        </Button>
      </div>
    </header>
  );
}
