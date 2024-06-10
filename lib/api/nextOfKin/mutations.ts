import { db } from "@/lib/db/index";
import { 
  NextOfKinId, 
  NewNextOfKinParams,
  UpdateNextOfKinParams, 
  updateNextOfKinSchema,
  insertNextOfKinSchema, 
  nextOfKinIdSchema 
} from "@/lib/db/schema/nextOfKin";

export const createNextOfKin = async (nextOfKin: NewNextOfKinParams) => {
  const newNextOfKin = insertNextOfKinSchema.parse(nextOfKin);
  try {
    const n = await db.nextOfKin.create({ data: newNextOfKin });
    return { nextOfKin: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateNextOfKin = async (id: NextOfKinId, nextOfKin: UpdateNextOfKinParams) => {
  const { id: nextOfKinId } = nextOfKinIdSchema.parse({ id });
  const newNextOfKin = updateNextOfKinSchema.parse(nextOfKin);
  try {
    const n = await db.nextOfKin.update({ where: { id: nextOfKinId }, data: newNextOfKin})
    return { nextOfKin: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteNextOfKin = async (id: NextOfKinId) => {
  const { id: nextOfKinId } = nextOfKinIdSchema.parse({ id });
  try {
    const n = await db.nextOfKin.delete({ where: { id: nextOfKinId }})
    return { nextOfKin: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

