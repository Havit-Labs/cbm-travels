import { db } from "@/lib/db/index";
import { type NextOfKinId, nextOfKinIdSchema } from "@/lib/db/schema/nextOfKin";

export const getNextOfKins = async () => {
  const n = await db.nextOfKin.findMany({include: { passenger: true}});
  return { nextOfKin: n };
};

export const getNextOfKinById = async (id: NextOfKinId) => {
  const { id: nextOfKinId } = nextOfKinIdSchema.parse({ id });
  const n = await db.nextOfKin.findFirst({
    where: { id: nextOfKinId},
    include: { passenger: true }
  });
  return { nextOfKin: n };
};


