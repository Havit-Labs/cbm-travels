import { Suspense } from "react";

import Loading from "@/app/loading";
import PassengerList from "@/components/passengers/PassengerList";
import { getPassengers } from "@/lib/api/passengers/queries";
import { getBookings } from "@/lib/api/bookings/queries";

export const revalidate = 0;

export default async function PassengersPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Passengers</h1>
        </div>
        <Passengers />
      </div>
    </main>
  );
}

const Passengers = async () => {
  
  const { passengers } = await getPassengers();
  const { bookings } = await getBookings();
  return (
    <Suspense fallback={<Loading />}>
      <pre>{JSON.stringify(passengers,null,2)}</pre>
      <PassengerList passengers={passengers} bookings={bookings} />
    </Suspense>
  );
};
