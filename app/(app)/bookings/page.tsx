import { Suspense } from "react";

import Loading from "@/app/loading";
import BookingList from "@/components/bookings/BookingList";
import { getBookings, getBookingsWithPassenger } from "@/lib/api/bookings/queries";
import { getVehicles } from "@/lib/api/vehicles/queries";
import {  getPassengers, } from "@/lib/api/passengers/queries";

export const revalidate = 0;

export default async function BookingsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Bookings</h1>
        </div>
        <Bookings />
      </div>
    </main>
  );
}

const Bookings = async () => {
  
  const { bookings } = await getBookings();
  const { vehicles } = await getVehicles();

  const {bookings : data} = await getBookingsWithPassenger()

  const result = await  getPassengers()
 

  return (
    <Suspense fallback={<Loading />}>
      <pre>{JSON.stringify(result, null,2)}</pre>
      <BookingList bookings={bookings} vehicles={vehicles} />
    </Suspense>
  );
};
