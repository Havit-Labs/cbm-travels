import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getBookingByIdWithPassengers } from "@/lib/api/bookings/queries";
import { getVehicles } from "@/lib/api/vehicles/queries";import OptimisticBooking from "@/app/(app)/bookings/[bookingId]/OptimisticBooking";
import PassengerList from "@/components/passengers/PassengerList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function BookingPage({
  params,
}: {
  params: { bookingId: string };
}) {

  return (
    <main className="overflow-auto">
      <Booking id={params.bookingId} />
    </main>
  );
}

const Booking = async ({ id }: { id: string }) => {
  
  const { booking, passengers } = await getBookingByIdWithPassengers(id);
  const { vehicles } = await getVehicles();

  if (!booking) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="bookings" />
        <OptimisticBooking booking={booking} vehicles={vehicles}
        vehicleId={booking.vehicleId} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{booking.paymentType}&apos;s Passengers</h3>
        <PassengerList
          bookings={[]}
          bookingId={booking.id}
          passengers={passengers}
        />
      </div>
    </Suspense>
  );
};
