import { Suspense } from "react";

import Loading from "@/app/loading";
import DriverList from "@/components/drivers/DriverList";
import { getDrivers } from "@/lib/api/drivers/queries";
import { getVehicles } from "@/lib/api/vehicles/queries";

export const revalidate = 0;

export default async function DriversPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Drivers</h1>
        </div>
        <Drivers />
      </div>
    </main>
  );
}

const Drivers = async () => {
  
  const { drivers } = await getDrivers();
  const { vehicles } = await getVehicles();
  return (
    <Suspense fallback={<Loading />}>
      <DriverList drivers={drivers} vehicles={vehicles} />
    </Suspense>
  );
};
