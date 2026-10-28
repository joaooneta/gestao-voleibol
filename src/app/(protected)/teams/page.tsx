import { prisma } from "@/lib/prisma";
import TeamForm from "./TeamForm";
import { getCurrentUser } from "@/lib/auth";
import TeamCard from "./TeamCard";

export default async function TeamsPage() {
  const user = await getCurrentUser();
  if (!user) return;

  const teams = await prisma.team.findMany({
    where: {
      trainerId: user.id,
    },
  });

  const name = user.name;
  const role =
    user.role === "competition" ? "Gestor de Torneio" : "Gestor de Equipes";

  return (
    <>
      <h2 className="text-3xl text-center ">
        Bem-vindo, {name} - {role}
      </h2>

      <div>
        <TeamForm />
      </div>

      <div className="flex flex-col gap-5 p-5">
        {teams.map((team) => (
          <TeamCard key={team.id} id={team.id} name={team.name} />
        ))}
      </div>
    </>
  );
}
