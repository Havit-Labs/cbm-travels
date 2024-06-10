import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getPassengerByIdWithNextOfKin } from "@/lib/api/passengers/queries";
import { getBookings } from "@/lib/api/bookings/queries";import OptimisticPassenger from "@/app/(app)/passengers/[passengerId]/OptimisticPassenger";
import NextOfKinList from "@/components/nextOfKin/NextOfKinList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function PassengerPage({
  params,
}: {
  params: { passengerId: string };
}) {

  return (
    <main className="overflow-auto">
      <Passenger id={params.passengerId} />
    </main>
  );
}

const Passenger = async ({ id }: { id: string }) => {
  
  const { passenger, nextOfKin } = await getPassengerByIdWithNextOfKin(id);
  const { bookings } = await getBookings();

  if (!passenger) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="passengers" />
        <OptimisticPassenger passenger={passenger} bookings={bookings} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{passenger.firstName}&apos;s Next Of Kin</h3>
        <NextOfKinList
          passengers={[]}
          passengerId={passenger.id}
          nextOfKin={nextOfKin}
        />
      </div>
    </Suspense>
  );
};
