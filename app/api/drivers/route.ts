import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createDriver,
  deleteDriver,
  updateDriver,
} from "@/lib/api/drivers/mutations";
import { 
  driverIdSchema,
  insertDriverParams,
  updateDriverParams 
} from "@/lib/db/schema/drivers";

export async function POST(req: Request) {
  try {
    const validatedData = insertDriverParams.parse(await req.json());
    const { driver } = await createDriver(validatedData);

    revalidatePath("/drivers"); // optional - assumes you will have named route same as entity

    return NextResponse.json(driver, { status: 201 });
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

    const validatedData = updateDriverParams.parse(await req.json());
    const validatedParams = driverIdSchema.parse({ id });

    const { driver } = await updateDriver(validatedParams.id, validatedData);

    return NextResponse.json(driver, { status: 200 });
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

    const validatedParams = driverIdSchema.parse({ id });
    const { driver } = await deleteDriver(validatedParams.id);

    return NextResponse.json(driver, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
