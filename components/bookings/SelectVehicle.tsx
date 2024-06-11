"use client";
import { Vehicle } from "@/lib/db/schema/vehicles";
import { Button } from "../ui/button";
import Modal from "../shared/Modal";
import { useMemo, useState } from "react";
import { Booking } from "@/lib/db/schema/bookings";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const SelectVehicle = ({
  vehicle,
  bookings,
}: {
  vehicle: Vehicle;
  bookings: Booking[];
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [open, setOpen] = useState(false);

  const handleSelect = () => {
    setOpen(true);
    const params = new URLSearchParams(searchParams);

    params.set("vId", vehicle.id);

    replace(`${pathname}?${params.toString()}`);
  };
  const seatNumbers = useMemo(() => {
    return bookings.flatMap((item) => item.seatNumber.split(",").map(Number));
  }, [bookings]);

  return (
    <div className="bg-gray-100 rounded-lg p-6 space-y-2">
      <h1 className="font-bold text-3xl">{vehicle.type}</h1>
      <p>{vehicle.capacity} seats available</p>
      <p className="font-bold text-2xl">₦ {vehicle.price.toLocaleString()}</p>

      <Button onClick={handleSelect}>Select Seat</Button>
      <Modal open={open} setOpen={setOpen} title="Select Seat(s)">
       
        <div className="space-y-6">
     
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: vehicle.capacity }, (_, index) => (
              <Button  disabled={seatNumbers.includes(index + 1)} key={index}>
                {index + 1}
           
              </Button>
            ))}
          </div>
          <Button className="w-full">Continue</Button>
        </div>
      </Modal>
    </div>
  );
};
