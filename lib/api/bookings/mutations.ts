import { db } from "@/lib/db/index";
import { 
  BookingId, 
  NewBookingParams,
  UpdateBookingParams, 
  updateBookingSchema,
  insertBookingSchema, 
  bookingIdSchema 
} from "@/lib/db/schema/bookings";

export const createBooking = async (booking: NewBookingParams) => {
  const newBooking = insertBookingSchema.parse(booking);
  try {
    const b = await db.booking.create({ data: newBooking });
    return { booking: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateBooking = async (id: BookingId, booking: UpdateBookingParams) => {
  const { id: bookingId } = bookingIdSchema.parse({ id });
  const newBooking = updateBookingSchema.parse(booking);
  try {
    const b = await db.booking.update({ where: { id: bookingId }, data: newBooking})
    return { booking: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteBooking = async (id: BookingId) => {
  const { id: bookingId } = bookingIdSchema.parse({ id });
  try {
    const b = await db.booking.delete({ where: { id: bookingId }})
    return { booking: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

