import { Suspense } from "react";

import Loading from "@/app/loading";
import BookingList from "@/components/bookings/BookingList";
import { getBookings } from "@/lib/api/bookings/queries";
import { getVehicles } from "@/lib/api/vehicles/queries";

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

  return (
    <Suspense fallback={<Loading />}>
      <BookingList bookings={bookings} vehicles={vehicles} />
    </Suspense>
  );
};
