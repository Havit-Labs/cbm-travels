import { db } from "@/lib/db/index";
import { 
  VehicleId, 
  NewVehicleParams,
  UpdateVehicleParams, 
  updateVehicleSchema,
  insertVehicleSchema, 
  vehicleIdSchema 
} from "@/lib/db/schema/vehicles";

export const createVehicle = async (vehicle: NewVehicleParams) => {
  const newVehicle = insertVehicleSchema.parse(vehicle);
  try {
    const v = await db.vehicle.create({ data: newVehicle });
    return { vehicle: v };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateVehicle = async (id: VehicleId, vehicle: UpdateVehicleParams) => {
  const { id: vehicleId } = vehicleIdSchema.parse({ id });
  const newVehicle = updateVehicleSchema.parse(vehicle);
  try {
    const v = await db.vehicle.update({ where: { id: vehicleId }, data: newVehicle})
    return { vehicle: v };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteVehicle = async (id: VehicleId) => {
  const { id: vehicleId } = vehicleIdSchema.parse({ id });
  try {
    const v = await db.vehicle.delete({ where: { id: vehicleId }})
    return { vehicle: v };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

