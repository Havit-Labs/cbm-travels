import { Suspense } from "react";

import Loading from "@/app/loading";
import NextOfKinList from "@/components/nextOfKin/NextOfKinList";
import { getNextOfKin } from "@/lib/api/nextOfKin/queries";
import { getPassengers } from "@/lib/api/passengers/queries";

export const revalidate = 0;

export default async function NextOfKinPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Next Of Kin</h1>
        </div>
        <NextOfKin />
      </div>
    </main>
  );
}

const NextOfKin = async () => {
  
  const { nextOfKin } = await getNextOfKin();
  const { passengers } = await getPassengers();
  return (
    <Suspense fallback={<Loading />}>
      <NextOfKinList nextOfKin={nextOfKin} passengers={passengers} />
    </Suspense>
  );
};
