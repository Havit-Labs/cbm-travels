import { db } from "@/lib/db/index";
import { type PassengerId, passengerIdSchema } from "@/lib/db/schema/passengers";

export const getPassengers = async () => {
  const p = await db.passenger.findMany({include: { booking: true}});
  return { passengers: p };
};

export const getPassengerById = async (id: PassengerId) => {
  const { id: passengerId } = passengerIdSchema.parse({ id });
  const p = await db.passenger.findFirst({
    where: { id: passengerId},
    include: { booking: true }
  });
  return { passenger: p };
};

export const getPassengerByIdWithNextOfKin = async (id: PassengerId) => {
  const { id: passengerId } = passengerIdSchema.parse({ id });
  const p = await db.passenger.findFirst({
    where: { id: passengerId},
    include: { booking: { include: {passengers: true } }, nextOfKin: { include: {passenger: true } } }
  });
  if (p === null) return { passenger: null };
  const { booking, nextOfKin, ...passenger } = p;

  return { passenger, booking:booking, nextOfKin:nextOfKin };
};

