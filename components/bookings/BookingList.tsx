"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Booking, CompleteBooking } from "@/lib/db/schema/bookings";
import Modal from "@/components/shared/Modal";
import { type Vehicle, type VehicleId } from "@/lib/db/schema/vehicles";
import { useOptimisticBookings } from "@/app/(app)/bookings/useOptimisticBookings";
import { Button } from "@/components/ui/button";
import BookingForm from "./BookingForm";
import { PlusIcon } from "lucide-react";
import { columns } from "@/app/(app)/bookings/columns";
import { DataTable } from "@/app/(app)/bookings/data-table";

type TOpenModal = (booking?: Booking) => void;

export default function BookingList({
  bookings,
  vehicles,
  vehicleId,
}: {
  bookings: CompleteBooking[];
  vehicles: Vehicle[];
  vehicleId?: VehicleId;
}) {
  const { optimisticBookings, addOptimisticBooking } = useOptimisticBookings(
    bookings,
    vehicles
  );
  const [open, setOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const openModal = (booking?: Booking) => {
    setOpen(true);
    booking ? setActiveBooking(booking) : setActiveBooking(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeBooking ? "Edit Booking" : "Create Booking"}
      >
        <BookingForm
          booking={activeBooking}
          addOptimistic={addOptimisticBooking}
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
      {optimisticBookings.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <>
          <ul>
            {optimisticBookings.map((booking) => (
              <Booking
                booking={booking}
                key={booking.id}
                openModal={openModal}
              />
            ))}
          </ul>

          <DataTable columns={columns} data={optimisticBookings} />
        </>
      )}
    </div>
  );
}

const Booking = ({
  booking,
  openModal,
}: {
  booking: CompleteBooking;
  openModal: TOpenModal;
}) => {
  const optimistic = booking.id === "optimistic";
  const deleting = booking.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("bookings")
    ? pathname
    : pathname + "/bookings/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{booking.paymentType}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + booking.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No bookings
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new booking.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Bookings{" "}
        </Button>
      </div>
    </div>
  );
};
