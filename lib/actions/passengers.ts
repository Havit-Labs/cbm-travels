"use server";

import { revalidatePath } from "next/cache";
import {
  createPassenger,
  deletePassenger,
  updatePassenger,
} from "@/lib/api/passengers/mutations";
import {
  PassengerId,
  NewPassengerParams,
  UpdatePassengerParams,
  passengerIdSchema,
  insertPassengerParams,
  updatePassengerParams,
} from "@/lib/db/schema/passengers";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidatePassengers = () => revalidatePath("/passengers");

export const createPassengerAction = async (input: NewPassengerParams) => {
  try {
    const payload = insertPassengerParams.parse(input);
    await createPassenger(payload);
    revalidatePassengers();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updatePassengerAction = async (input: UpdatePassengerParams) => {
  try {
    const payload = updatePassengerParams.parse(input);
    await updatePassenger(payload.id, payload);
    revalidatePassengers();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deletePassengerAction = async (input: PassengerId) => {
  try {
    const payload = passengerIdSchema.parse({ id: input });
    await deletePassenger(payload.id);
    revalidatePassengers();
  } catch (e) {
    return handleErrors(e);
  }
};