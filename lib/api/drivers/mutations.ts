import { db } from "@/lib/db/index";
import { 
  DriverId, 
  NewDriverParams,
  UpdateDriverParams, 
  updateDriverSchema,
  insertDriverSchema, 
  driverIdSchema 
} from "@/lib/db/schema/drivers";

export const createDriver = async (driver: NewDriverParams) => {
  const newDriver = insertDriverSchema.parse(driver);
  try {
    const d = await db.driver.create({ data: newDriver });
    return { driver: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateDriver = async (id: DriverId, driver: UpdateDriverParams) => {
  const { id: driverId } = driverIdSchema.parse({ id });
  const newDriver = updateDriverSchema.parse(driver);
  try {
    const d = await db.driver.update({ where: { id: driverId }, data: newDriver})
    return { driver: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteDriver = async (id: DriverId) => {
  const { id: driverId } = driverIdSchema.parse({ id });
  try {
    const d = await db.driver.delete({ where: { id: driverId }})
    return { driver: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

