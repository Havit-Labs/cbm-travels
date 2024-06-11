import { BookTicketForm } from "@/components/bookings/BookTripForm";
import { SelectVehicle } from "@/components/bookings/SelectVehicle";
import { getBookingsByVehicleId } from "@/lib/api/bookings/queries";
import {   getVehiclesWithParams } from "@/lib/api/vehicles/queries";

export default async function CreateBooking({
  searchParams,
}: {
  searchParams: any;
}) {
  const { d, a, vId, } = searchParams;
  const { vehicles } = await getVehiclesWithParams({
    departure:d,
    arrival:a
  });
 const {bookings} =  await getBookingsByVehicleId(vId)

  return (
    <div>
        <BookTicketForm />
     <div className="grid grid-cols-2 gap-6">

      {vehicles.map((v,i) => <SelectVehicle key={i} vehicle={v} bookings={bookings} />)}
     </div>
    </div>
  );
}
