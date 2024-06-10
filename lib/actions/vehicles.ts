"use server";

import { revalidatePath } from "next/cache";
import {
  createVehicle,
  deleteVehicle,
  updateVehicle,
} from "@/lib/api/vehicles/mutations";
import {
  VehicleId,
  NewVehicleParams,
  UpdateVehicleParams,
  vehicleIdSchema,
  insertVehicleParams,
  updateVehicleParams,
} from "@/lib/db/schema/vehicles";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateVehicles = () => revalidatePath("/vehicles");

export const createVehicleAction = async (input: NewVehicleParams) => {
  try {
    const payload = insertVehicleParams.parse(input);
    await createVehicle(payload);
    revalidateVehicles();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateVehicleAction = async (input: UpdateVehicleParams) => {
  try {
    const payload = updateVehicleParams.parse(input);
    await updateVehicle(payload.id, payload);
    revalidateVehicles();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteVehicleAction = async (input: VehicleId) => {
  try {
    const payload = vehicleIdSchema.parse({ id: input });
    await deleteVehicle(payload.id);
    revalidateVehicles();
  } catch (e) {
    return handleErrors(e);
  }
};