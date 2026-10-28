import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import TournamentForm from "./TournamentForm";
import TournamentCard from "./TournamentCard";

export default async function TournamentsPage() {
  const user = await getCurrentUser();
  if (!user) return;

  const tournaments = await prisma.tournament.findMany({
    where: {
      managerId: user.id,
    },
  });

  const name = user.name;
  const role =
    user.role === "TOURNAMENT_MANAGER"
      ? "Gestor de Torneio"
      : "Gestor de Equipes";

  console.log(tournaments);

  return (
    <>
      <h2 className="text-3xl text-center ">
        Bem-vindo, {name} - {role}
      </h2>

      <div>
        <TournamentForm />
      </div>

      <div className="flex flex-col gap-5 p-5">
        {tournaments.map((tournament) => (
          <TournamentCard
            key={tournament.id}
            id={tournament.id}
            name={tournament.name}
            status={tournament.status}
          />
        ))}
      </div>
    </>
  );
}
