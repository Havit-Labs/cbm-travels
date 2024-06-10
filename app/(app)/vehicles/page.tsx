import { Suspense } from "react";

import Loading from "@/app/loading";
import VehicleList from "@/components/vehicles/VehicleList";
import { getVehicles } from "@/lib/api/vehicles/queries";


export const revalidate = 0;

export default async function VehiclesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Vehicles</h1>
        </div>
        <Vehicles />
      </div>
    </main>
  );
}

const Vehicles = async () => {
  
  const { vehicles } = await getVehicles();
  
  return (
    <Suspense fallback={<Loading />}>
      <VehicleList vehicles={vehicles}  />
    </Suspense>
  );
};
