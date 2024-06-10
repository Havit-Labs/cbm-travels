"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/next-of-kin/useOptimisticNextOfKin";
import { type NextOfKin } from "@/lib/db/schema/nextOfKin";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import NextOfKinForm from "@/components/nextOfKin/NextOfKinForm";
import { type Passenger, type PassengerId } from "@/lib/db/schema/passengers";

export default function OptimisticNextOfKin({ 
  nextOfKin,
  passengers,
  passengerId 
}: { 
  nextOfKin: NextOfKin; 
  
  passengers: Passenger[];
  passengerId?: PassengerId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: NextOfKin) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticNextOfKin, setOptimisticNextOfKin] = useOptimistic(nextOfKin);
  const updateNextOfKin: TAddOptimistic = (input) =>
    setOptimisticNextOfKin({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <NextOfKinForm
          nextOfKin={optimisticNextOfKin}
          passengers={passengers}
        passengerId={passengerId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateNextOfKin}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticNextOfKin.fullName}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticNextOfKin.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticNextOfKin, null, 2)}
      </pre>
    </div>
  );
}
