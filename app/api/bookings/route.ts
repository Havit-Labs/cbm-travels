import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createBooking,
  deleteBooking,
  updateBooking,
} from "@/lib/api/bookings/mutations";
import { 
  bookingIdSchema,
  insertBookingParams,
  updateBookingParams 
} from "@/lib/db/schema/bookings";

export async function POST(req: Request) {
  try {
    const validatedData = insertBookingParams.parse(await req.json());
    const { booking } = await createBooking(validatedData);

    revalidatePath("/bookings"); // optional - assumes you will have named route same as entity

    return NextResponse.json(booking, { status: 201 });
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

    const validatedData = updateBookingParams.parse(await req.json());
    const validatedParams = bookingIdSchema.parse({ id });

    const { booking } = await updateBooking(validatedParams.id, validatedData);

    return NextResponse.json(booking, { status: 200 });
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

    const validatedParams = bookingIdSchema.parse({ id });
    const { booking } = await deleteBooking(validatedParams.id);

    return NextResponse.json(booking, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
