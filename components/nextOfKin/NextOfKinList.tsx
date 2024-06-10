"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type NextOfKin, CompleteNextOfKin } from "@/lib/db/schema/nextOfKin";
import Modal from "@/components/shared/Modal";
import { type Passenger, type PassengerId } from "@/lib/db/schema/passengers";
import { useOptimisticNextOfKins } from "@/app/(app)/next-of-kin/useOptimisticNextOfKin";
import { Button } from "@/components/ui/button";
import NextOfKinForm from "./NextOfKinForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (nextOfKin?: NextOfKin) => void;

export default function NextOfKinList({
  nextOfKin,
  passengers,
  passengerId 
}: {
  nextOfKin: CompleteNextOfKin[];
  passengers: Passenger[];
  passengerId?: PassengerId 
}) {
  const { optimisticNextOfKins, addOptimisticNextOfKin } = useOptimisticNextOfKins(
    nextOfKin,
    passengers 
  );
  const [open, setOpen] = useState(false);
  const [activeNextOfKin, setActiveNextOfKin] = useState<NextOfKin | null>(null);
  const openModal = (nextOfKin?: NextOfKin) => {
    setOpen(true);
    nextOfKin ? setActiveNextOfKin(nextOfKin) : setActiveNextOfKin(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeNextOfKin ? "Edit NextOfKin" : "Create Next Of Kin"}
      >
        <NextOfKinForm
          nextOfKin={activeNextOfKin}
          addOptimistic={addOptimisticNextOfKin}
          openModal={openModal}
          closeModal={closeModal}
          passengers={passengers}
        passengerId={passengerId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticNextOfKins.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticNextOfKins.map((nextOfKin) => (
            <NextOfKin
              nextOfKin={nextOfKin}
              key={nextOfKin.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const NextOfKin = ({
  nextOfKin,
  openModal,
}: {
  nextOfKin: CompleteNextOfKin;
  openModal: TOpenModal;
}) => {
  const optimistic = nextOfKin.id === "optimistic";
  const deleting = nextOfKin.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("next-of-kin")
    ? pathname
    : pathname + "/next-of-kin/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{nextOfKin.fullName}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + nextOfKin.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No next of kin
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new next of kin.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Next Of Kin </Button>
      </div>
    </div>
  );
};
