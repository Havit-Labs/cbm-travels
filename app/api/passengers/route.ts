import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createPassenger,
  deletePassenger,
  updatePassenger,
} from "@/lib/api/passengers/mutations";
import { 
  passengerIdSchema,
  insertPassengerParams,
  updatePassengerParams 
} from "@/lib/db/schema/passengers";

export async function POST(req: Request) {
  try {
    const validatedData = insertPassengerParams.parse(await req.json());
    const { passenger } = await createPassenger(validatedData);

    revalidatePath("/passengers"); // optional - assumes you will have named route same as entity

    return NextResponse.json(passenger, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updatePassengerParams.parse(await req.json());
    const validatedParams = passengerIdSchema.parse({ id });

    const { passenger } = await updatePassenger(validatedParams.id, validatedData);

    return NextResponse.json(passenger, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = passengerIdSchema.parse({ id });
    const { passenger } = await deletePassenger(validatedParams.id);

    return NextResponse.json(passenger, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
