import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getNextOfKinById } from "@/lib/api/nextOfKin/queries";
import { getPassengers } from "@/lib/api/passengers/queries";import OptimisticNextOfKin from "@/app/(app)/next-of-kin/[nextOfKinId]/OptimisticNextOfKin";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function NextOfKinPage({
  params,
}: {
  params: { nextOfKinId: string };
}) {

  return (
    <main className="overflow-auto">
      <NextOfKin id={params.nextOfKinId} />
    </main>
  );
}

const NextOfKin = async ({ id }: { id: string }) => {
  
  const { nextOfKin } = await getNextOfKinById(id);
  const { passengers } = await getPassengers();

  if (!nextOfKin) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="next-of-kin" />
        <OptimisticNextOfKin nextOfKin={nextOfKin} passengers={passengers} />
      </div>
    </Suspense>
  );
};
