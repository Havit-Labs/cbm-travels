import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getDriverById } from "@/lib/api/drivers/queries";
import { getVehicles } from "@/lib/api/vehicles/queries";
import OptimisticDriver from "@/app/(app)/drivers/[driverId]/OptimisticDriver";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function DriverPage({
  params,
}: {
  params: { driverId: string };
}) {

  return (
    <main className="overflow-auto">
      <Driver id={params.driverId} />
    </main>
  );
}

const Driver = async ({ id }: { id: string }) => {
  
  const { driver } = await getDriverById(id);
  const { vehicles } = await getVehicles();

  if (!driver) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="drivers" />
        <OptimisticDriver driver={driver} vehicles={vehicles} />
      </div>
    </Suspense>
  );
};
