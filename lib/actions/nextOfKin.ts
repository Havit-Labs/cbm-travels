"use server";

import { revalidatePath } from "next/cache";
import {
  createNextOfKin,
  deleteNextOfKin,
  updateNextOfKin,
} from "@/lib/api/nextOfKin/mutations";
import {
  NextOfKinId,
  NewNextOfKinParams,
  UpdateNextOfKinParams,
  nextOfKinIdSchema,
  insertNextOfKinParams,
  updateNextOfKinParams,
} from "@/lib/db/schema/nextOfKin";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateNextOfKins = () => revalidatePath("/next-of-kin");

export const createNextOfKinAction = async (input: NewNextOfKinParams) => {
  try {
    const payload = insertNextOfKinParams.parse(input);
    await createNextOfKin(payload);
    revalidateNextOfKins();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateNextOfKinAction = async (input: UpdateNextOfKinParams) => {
  try {
    const payload = updateNextOfKinParams.parse(input);
    await updateNextOfKin(payload.id, payload);
    revalidateNextOfKins();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteNextOfKinAction = async (input: NextOfKinId) => {
  try {
    const payload = nextOfKinIdSchema.parse({ id: input });
    await deleteNextOfKin(payload.id);
    revalidateNextOfKins();
  } catch (e) {
    return handleErrors(e);
  }
};