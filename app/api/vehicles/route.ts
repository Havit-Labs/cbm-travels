import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createVehicle,
  deleteVehicle,
  updateVehicle,
} from "@/lib/api/vehicles/mutations";
import { 
  vehicleIdSchema,
  insertVehicleParams,
  updateVehicleParams 
} from "@/lib/db/schema/vehicles";

export async function POST(req: Request) {
  try {
    const validatedData = insertVehicleParams.parse(await req.json());
    const { vehicle } = await createVehicle(validatedData);

    revalidatePath("/vehicles"); // optional - assumes you will have named route same as entity

    return NextResponse.json(vehicle, { status: 201 });
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

    const validatedData = updateVehicleParams.parse(await req.json());
    const validatedParams = vehicleIdSchema.parse({ id });

    const { vehicle } = await updateVehicle(validatedParams.id, validatedData);

    return NextResponse.json(vehicle, { status: 200 });
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

    const validatedParams = vehicleIdSchema.parse({ id });
    const { vehicle } = await deleteVehicle(validatedParams.id);

    return NextResponse.json(vehicle, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
