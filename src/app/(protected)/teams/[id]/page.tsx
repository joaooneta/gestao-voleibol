import { getCurrentUser } from "@/lib/auth";
import AthleteForm from "./AthleteForm";
import { prisma } from "@/lib/prisma";
import AthleteCard from "./AthleteCard";

export default async function AddPlayerPage(props: PageProps<"/teams/[id]">) {
  const user = await getCurrentUser();
  if (!user) return;

  const { id } = await props.params;

  const team = await prisma.team.findFirst({
    where: {
      id: id,
    },
  });

  if (!team) return;

  const athletes = await prisma.athlete.findMany({ where: { teamId: id } });
  console.log("atletas:", athletes);

  return (
    <div>
      <h2 className="text-3xl text-center ">{team.name}</h2>

      <AthleteForm teamId={id} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {athletes.map((athlete) => (
          <AthleteCard
            key={athlete.id}
            id={athlete.id}
            name={athlete.name}
            age={athlete.age}
            position={athlete.position}
            teamId={id}
          />
        ))}
      </div>
    </div>
  );
}
