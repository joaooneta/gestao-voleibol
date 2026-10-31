import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SubscribeTournamentForm from "./SubscribeTournamentForm";

export default async function ExploreTournaments() {
  const user = await getCurrentUser();
  if (!user) return;

  const tournaments = await prisma.tournament.findMany({
    where: {
      status: "OPEN",
    },
  });

  const teams = await prisma.team.findMany({
    where: { trainerId: user.id },
  });

  console.log("Torneios", tournaments);
  console.log("Times", teams);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <h2 className="text-3xl text-center">Torneios Abertos</h2>

      <SubscribeTournamentForm teams={teams} tournaments={tournaments} />
    </div>
  );
}
