"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Vehicle, CompleteVehicle } from "@/lib/db/schema/vehicles";
import Modal from "@/components/shared/Modal";

import { useOptimisticVehicles } from "@/app/(app)/vehicles/useOptimisticVehicles";
import { Button } from "@/components/ui/button";
import VehicleForm from "./VehicleForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (vehicle?: Vehicle) => void;

export default function VehicleList({
  vehicles,
   
}: {
  vehicles: CompleteVehicle[];
   
}) {
  const { optimisticVehicles, addOptimisticVehicle } = useOptimisticVehicles(
    vehicles,
     
  );
  const [open, setOpen] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const openModal = (vehicle?: Vehicle) => {
    setOpen(true);
    vehicle ? setActiveVehicle(vehicle) : setActiveVehicle(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeVehicle ? "Edit Vehicle" : "Create Vehicle"}
      >
        <VehicleForm
          vehicle={activeVehicle}
          addOptimistic={addOptimisticVehicle}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticVehicles.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticVehicles.map((vehicle) => (
            <Vehicle
              vehicle={vehicle}
              key={vehicle.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Vehicle = ({
  vehicle,
  openModal,
}: {
  vehicle: CompleteVehicle;
  openModal: TOpenModal;
}) => {
  const optimistic = vehicle.id === "optimistic";
  const deleting = vehicle.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("vehicles")
    ? pathname
    : pathname + "/vehicles/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{vehicle.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + vehicle.id }>
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
        No vehicles
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new vehicle.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Vehicles </Button>
      </div>
    </div>
  );
};
