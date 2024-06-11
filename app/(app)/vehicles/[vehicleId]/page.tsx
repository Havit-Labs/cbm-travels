import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getVehicleByIdWithDriversAndBookings } from "@/lib/api/vehicles/queries";
import OptimisticVehicle from "./OptimisticVehicle";
import DriverList from "@/components/drivers/DriverList";
import BookingList from "@/components/bookings/BookingList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function VehiclePage({
  params,
}: {
  params: { vehicleId: string };
}) {

  return (
    <main className="overflow-auto">
      <Vehicle id={params.vehicleId} />
    </main>
  );
}

const Vehicle = async ({ id }: { id: string }) => {
  
  const { vehicle,  bookings } = await getVehicleByIdWithDriversAndBookings(id);
  

  if (!vehicle) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="vehicles" />
        <OptimisticVehicle vehicle={vehicle}  />
      </div>
    
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{vehicle.name}&apos;s Bookings</h3>
        <BookingList
          vehicles={[]}
          vehicleId={vehicle.id}
          bookings={bookings}
        />
      </div>
    </Suspense>
  );
};
