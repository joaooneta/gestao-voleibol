import { getCurrentUser } from "@/lib/auth";
import { Surface } from "@heroui/react";

export default async function TeamsPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1>TeamsPage</h1>

      {user && <h2>Bem-vindo, {user.name}</h2>}
    </div>
  );
}
