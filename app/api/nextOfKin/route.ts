import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createNextOfKin,
  deleteNextOfKin,
  updateNextOfKin,
} from "@/lib/api/nextOfKin/mutations";
import { 
  nextOfKinIdSchema,
  insertNextOfKinParams,
  updateNextOfKinParams 
} from "@/lib/db/schema/nextOfKin";

export async function POST(req: Request) {
  try {
    const validatedData = insertNextOfKinParams.parse(await req.json());
    const { nextOfKin } = await createNextOfKin(validatedData);

    revalidatePath("/nextOfKin"); // optional - assumes you will have named route same as entity

    return NextResponse.json(nextOfKin, { status: 201 });
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

    const validatedData = updateNextOfKinParams.parse(await req.json());
    const validatedParams = nextOfKinIdSchema.parse({ id });

    const { nextOfKin } = await updateNextOfKin(validatedParams.id, validatedData);

    return NextResponse.json(nextOfKin, { status: 200 });
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

    const validatedParams = nextOfKinIdSchema.parse({ id });
    const { nextOfKin } = await deleteNextOfKin(validatedParams.id);

    return NextResponse.json(nextOfKin, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
