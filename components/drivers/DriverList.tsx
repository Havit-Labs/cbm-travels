"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Driver, CompleteDriver } from "@/lib/db/schema/drivers";
import Modal from "@/components/shared/Modal";
import { type Vehicle, type VehicleId } from "@/lib/db/schema/vehicles";
import { useOptimisticDrivers } from "@/app/(app)/drivers/useOptimisticDrivers";
import { Button } from "@/components/ui/button";
import DriverForm from "./DriverForm";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/app/(app)/drivers/data-table";
import { columns } from "@/app/(app)/drivers/columns";

type TOpenModal = (driver?: Driver) => void;

export default function DriverList({
  drivers,
  vehicles,
  vehicleId,
}: {
  drivers: CompleteDriver[];
  vehicles: Vehicle[];
  vehicleId?: VehicleId;
}) {
  const { optimisticDrivers, addOptimisticDriver } = useOptimisticDrivers(
    drivers,
    vehicles
  );
  const [open, setOpen] = useState(false);
  const [activeDriver, setActiveDriver] = useState<Driver | null>(null);
  const openModal = (driver?: Driver) => {
    setOpen(true);
    driver ? setActiveDriver(driver) : setActiveDriver(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeDriver ? "Edit Driver" : "Create Driver"}
      >
        <DriverForm
          driver={activeDriver}
          addOptimistic={addOptimisticDriver}
          openModal={openModal}
          closeModal={closeModal}
          vehicles={vehicles}
          vehicleId={vehicleId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticDrivers.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable columns={columns} data={optimisticDrivers} />
      )}
    </div>
  );
}

const Driver = ({
  driver,
  openModal,
}: {
  driver: CompleteDriver;
  openModal: TOpenModal;
}) => {
  const optimistic = driver.id === "optimistic";
  const deleting = driver.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("drivers")
    ? pathname
    : pathname + "/drivers/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{driver.firstName}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + driver.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No drivers
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new driver.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Drivers{" "}
        </Button>
      </div>
    </div>
  );
};
