import { db } from "@/lib/db/index";
import { type VehicleId, vehicleIdSchema } from "@/lib/db/schema/vehicles";

export const getVehicles = async () => {
  const v = await db.vehicle.findMany({});
  return { vehicles: v };
};

export const getVehicleById = async (id: VehicleId) => {
  const { id: vehicleId } = vehicleIdSchema.parse({ id });
  const v = await db.vehicle.findFirst({
    where: { id: vehicleId}});
  return { vehicle: v };
};

export const getVehicleByIdWithDriversAndBookings = async (id: VehicleId) => {
  const { id: vehicleId } = vehicleIdSchema.parse({ id });
  const v = await db.vehicle.findFirst({
    where: { id: vehicleId},
    include: { drivers: { include: {vehicle: true } }, bookings: { include: {vehicle: true } } }
  });
  if (v === null) return { vehicle: null };
  const { drivers, bookings, ...vehicle } = v;

  return { vehicle, drivers:drivers, bookings:bookings };
};

