"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/vehicles/useOptimisticVehicles";
import { type Vehicle } from "@/lib/db/schema/vehicles";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import VehicleForm from "@/components/vehicles/VehicleForm";


export default function OptimisticVehicle({ 
  vehicle,
   
}: { 
  vehicle: Vehicle; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Vehicle) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticVehicle, setOptimisticVehicle] = useOptimistic(vehicle);
  const updateVehicle: TAddOptimistic = (input) =>
    setOptimisticVehicle({ ...input.data });



  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <VehicleForm
          vehicle={optimisticVehicle}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateVehicle}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticVehicle.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticVehicle.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticVehicle, null, 2)}
      </pre>
    </div>
  );
}
