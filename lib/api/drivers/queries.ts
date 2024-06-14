import { db } from "@/lib/db/index";
import { type DriverId, driverIdSchema } from "@/lib/db/schema/drivers";

export const getDrivers = async () => {
  const d = await db.driver.findMany({ include: { vehicle: true } });
  return { drivers: d };
};

export const getDriverById = async (id: DriverId) => {
  const { id: driverId } = driverIdSchema.parse({ id });
  const d = await db.driver.findFirst({
    where: { id: driverId },
    // include: { vehicle: true }
  });
  return { driver: d };
};
