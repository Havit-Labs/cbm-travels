import { db } from "@/lib/db/index";
import { type VehicleId, vehicleIdSchema } from "@/lib/db/schema/vehicles";

type Params = {
  departure?: string;
  arrival?: string;
  skip?: number;
  take?: number;
};

export const getVehicles = async ({ departure, arrival, take = 20 }: Params) => {

  const v = await db.vehicle.findMany({
    where: {
      departure,
      arrival,
    },
    take,
  });
  return { vehicles: v };
};

export const getVehicleById = async (id: VehicleId) => {
  const { id: vehicleId } = vehicleIdSchema.parse({ id });
  const v = await db.vehicle.findFirst({
    where: { id: vehicleId },
  });
  return { vehicle: v };
};

export const getVehicleByIdWithDriversAndBookings = async (id: VehicleId) => {
  const { id: vehicleId } = vehicleIdSchema.parse({ id });
  const v = await db.vehicle.findFirst({
    where: { id: vehicleId },
    include: {
      drivers: { include: { vehicle: true } },
      bookings: { include: { vehicle: true } },
    },
  });
  if (v === null) return { vehicle: null };
  const { drivers, bookings, ...vehicle } = v;

  return { vehicle, drivers: drivers, bookings: bookings };
};
