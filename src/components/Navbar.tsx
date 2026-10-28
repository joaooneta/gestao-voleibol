"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const teamManagerLinks = [
  { url: "/teams", label: "Criar Times" },
  { url: "/explore/tournaments", label: "Buscar Torneios" },
];

const tournamentManagerLinks = [
  { url: "/tournaments", label: "Criar Torneios" },
];

export default function Navbar() {
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
        <Link href={"/teams"} className="text-white">
          Times
        </Link>

        <Link href={"/tournaments"} className="text-white">
          Torneios
        </Link>

        <Link href={"/explore/tournaments"} className="text-white">
          Buscar Torneios
        </Link>

        <Button variant="secondary" onClick={logout}>
          Deslogar
        </Button>
      </div>
    </header>
  );
}
