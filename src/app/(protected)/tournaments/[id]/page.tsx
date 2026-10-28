import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ManageSubscription from "./ManageSubscription";
import ManageTournament from "./ManageTournament";
import TournamentResult from "./TournamentResult";

export default async function TournamentPage(
  props: PageProps<"/tournaments/[id]">,
) {
  const user = await getCurrentUser();
  if (!user) return;

  const { id } = await props.params;

  const tournament = await prisma.tournament.findFirst({
    where: {
      id: id,
    },
    include: {
      tournamentTeams: {
        include: {
          team: true,
        },
      },

      matches: true,
    },
  });

  if (!tournament) return;

  console.log(tournament.matches);

  return (
    <>
      {tournament.status === "OPEN" && (
        <ManageSubscription tournament={tournament} />
      )}

      {tournament.status === "IN_PROGRESS" && (
        <ManageTournament tournament={tournament} />
      )}

      {tournament.status === "FINISHED" && (
        <TournamentResult tournament={tournament} />
      )}
    </>
  );
}
