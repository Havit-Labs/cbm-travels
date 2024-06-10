"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Passenger, CompletePassenger } from "@/lib/db/schema/passengers";
import Modal from "@/components/shared/Modal";
import { type Booking, type BookingId } from "@/lib/db/schema/bookings";
import { useOptimisticPassengers } from "@/app/(app)/passengers/useOptimisticPassengers";
import { Button } from "@/components/ui/button";
import PassengerForm from "./PassengerForm";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/app/(app)/passengers/data-table";
import { columns } from "@/app/(app)/passengers/columns";

type TOpenModal = (passenger?: Passenger) => void;

export default function PassengerList({
  passengers,
  bookings,
  bookingId 
}: {
  passengers: CompletePassenger[];
  bookings: Booking[];
  bookingId?: BookingId 
}) {
  const { optimisticPassengers, addOptimisticPassenger } = useOptimisticPassengers(
    passengers,
    bookings 
  );
  const [open, setOpen] = useState(false);
  const [activePassenger, setActivePassenger] = useState<Passenger | null>(null);
  const openModal = (passenger?: Passenger) => {
    setOpen(true);
    passenger ? setActivePassenger(passenger) : setActivePassenger(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activePassenger ? "Edit Passenger" : "Create Passenger"}
      >
        <PassengerForm
          passenger={activePassenger}
          addOptimistic={addOptimisticPassenger}
          openModal={openModal}
          closeModal={closeModal}
          bookings={bookings}
        bookingId={bookingId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticPassengers.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
     <DataTable columns={columns} data={optimisticPassengers} />
          {optimisticPassengers.map((passenger) => (
            <Passenger
              passenger={passenger}
              key={passenger.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Passenger = ({
  passenger,
  openModal,
}: {
  passenger: CompletePassenger;
  openModal: TOpenModal;
}) => {
  const optimistic = passenger.id === "optimistic";
  const deleting = passenger.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("passengers")
    ? pathname
    : pathname + "/passengers/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{passenger.firstName}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + passenger.id }>
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
        No passengers
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new passenger.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Passengers </Button>
      </div>
    </div>
  );
};
