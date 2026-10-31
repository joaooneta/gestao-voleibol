"use client";

import { ListBox, Select } from "@heroui/react";
import { useState } from "react";
import { Team, Tournament } from "../../../../../generated/prisma/browser";
import SubscribeTournamentCard from "./SubscribeTournamentCard";

type SubscribeTournamentFormProps = {
  teams: Team[];
  tournaments: Tournament[];
};

export default function SubscribeTournamentForm({
  teams,
  tournaments,
}: SubscribeTournamentFormProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);

  return (
    <>
      <div>
        <Select
          className="w-[200px]"
          aria-label="Selecionar time"
          selectedKey={selectedTeam ? selectedTeam.id : undefined}
          onSelectionChange={(key) => {
            const found = teams.find((t) => t.id === key);
            if (found) setSelectedTeam(found);
          }}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {teams.map((team) => (
                <ListBox.Item key={team.id} id={team.id} textValue={team.name}>
                  {team.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className="flex flex-col gap-5 p-5 w-full">
        {tournaments.map((tournament) => (
          <SubscribeTournamentCard
            key={tournament.id}
            id={tournament.id}
            name={tournament.name}
            team={selectedTeam}
            tournament={tournament}
          />
        ))}
      </div>
    </>
  );
}
