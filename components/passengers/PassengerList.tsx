"use client";

import { useState } from "react";

import { columns } from "@/app/(app)/passengers/columns";
import { DataTable } from "@/app/(app)/passengers/data-table";
import { useOptimisticPassengers } from "@/app/(app)/passengers/useOptimisticPassengers";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { type Booking, type BookingId } from "@/lib/db/schema/bookings";
import { CompletePassenger, type Passenger } from "@/lib/db/schema/passengers";
import { PlusIcon } from "lucide-react";
import PassengerForm from "./PassengerForm";

type TOpenModal = (passenger?: Passenger) => void;

export default function PassengerList({
  passengers,
  bookings,
  bookingId,
}: {
  passengers: CompletePassenger[];
  bookings: Booking[];
  bookingId?: BookingId;
}) {
  const { optimisticPassengers, addOptimisticPassenger } =
    useOptimisticPassengers(passengers, bookings);
  const [open, setOpen] = useState(false);
  const [activePassenger, setActivePassenger] = useState<Passenger | null>(
    null
  );
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
      {!optimisticPassengers ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable columns={columns} data={optimisticPassengers} />
      )}
    </div>
  );
}



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
          <PlusIcon className="h-4" /> New Passengers{" "}
        </Button>
      </div>
    </div>
  );
};
