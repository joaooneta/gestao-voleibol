import { Dispatch, SetStateAction } from "react";
import { Tournament } from "../../../../../generated/prisma/browser";

import { Button, Modal } from "@heroui/react";

type TournamentInfoModalProps = {
  tournament: Tournament;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function TournamentInfoModal({
  tournament,
  isModalOpen,
  setIsModalOpen,
}: TournamentInfoModalProps) {
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  let tournamentGender;
  if (tournament.gender === "MALE") tournamentGender = "masculino";
  if (tournament.gender === "FEMALE") tournamentGender = "feminino";
  if (tournament.gender === "MIXED") tournamentGender = "masculino";

  return (
    <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[360px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Informações do Torneio</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-3 text-xl">
              <p>
                <span className="font-semibold">Jogadores minimos: </span>
                {tournament.minPlayers}
              </p>

              <p>
                <span className="font-semibold">Jogadores maximos: </span>
                {tournament.maxPlayers}
              </p>

              <p>
                <span className="font-semibold">Idade minima: </span>
                {tournament.minAge} anos
              </p>

              <p>
                <span className="font-semibold">Idade maxima: </span>
                {tournament.maxAge} anos
              </p>

              <p>
                <span className="font-semibold">Genero: </span>
                {tournamentGender}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="w-full"
                slot="close"
                onClick={handleCloseModal}
              >
                Fechar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
