import { Button } from "@heroui/react";
import Link from "next/link";

export default async function TournamentManagerNavbar() {
  return (
    <header className="p-5 border-b mb-5 bg-accent">
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
      </div>
    </header>
  );
}
