import { db } from "@/lib/db/index";
import { 
  PassengerId, 
  NewPassengerParams,
  UpdatePassengerParams, 
  updatePassengerSchema,
  insertPassengerSchema, 
  passengerIdSchema 
} from "@/lib/db/schema/passengers";

export const createPassenger = async (passenger: NewPassengerParams) => {
  const newPassenger = insertPassengerSchema.parse(passenger);
  try {
    const p = await db.passenger.create({ data: newPassenger });
    return { passenger: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updatePassenger = async (id: PassengerId, passenger: UpdatePassengerParams) => {
  const { id: passengerId } = passengerIdSchema.parse({ id });
  const newPassenger = updatePassengerSchema.parse(passenger);
  try {
    const p = await db.passenger.update({ where: { id: passengerId }, data: newPassenger})
    return { passenger: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deletePassenger = async (id: PassengerId) => {
  const { id: passengerId } = passengerIdSchema.parse({ id });
  try {
    const p = await db.passenger.delete({ where: { id: passengerId }})
    return { passenger: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

