"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/passengers/useOptimisticPassengers";
import { type Passenger } from "@/lib/db/schema/passengers";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import PassengerForm from "@/components/passengers/PassengerForm";
import { type Booking, type BookingId } from "@/lib/db/schema/bookings";

export default function OptimisticPassenger({ 
  passenger,
  bookings,
  bookingId 
}: { 
  passenger: Passenger; 
  
  bookings: Booking[];
  bookingId?: BookingId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Passenger) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticPassenger, setOptimisticPassenger] = useOptimistic(passenger);
  const updatePassenger: TAddOptimistic = (input) =>
    setOptimisticPassenger({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <PassengerForm
          passenger={optimisticPassenger}
          bookings={bookings}
        bookingId={bookingId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updatePassenger}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticPassenger.firstName}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticPassenger.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticPassenger, null, 2)}
      </pre>
    </div>
  );
}
