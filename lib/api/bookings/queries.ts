import { db } from "@/lib/db/index";
import { type BookingId, bookingIdSchema } from "@/lib/db/schema/bookings";

export const getBookings = async () => {
  const b = await db.booking.findMany({ include: { vehicle: true } });
  return { bookings: b };
};

export const getBookingById = async (id: BookingId) => {
  const { id: bookingId } = bookingIdSchema.parse({ id });
  const b = await db.booking.findFirst({
    where: { id: bookingId },
    include: { vehicle: true },
  });
  return { booking: b };
};

export const getBookingByIdWithPassengers = async (id: BookingId) => {
  const { id: bookingId } = bookingIdSchema.parse({ id });
  const b = await db.booking.findFirst({
    where: { id: bookingId },
    include: {
      vehicle: { include: { bookings: true } },
      passenger: { include: { booking: true } },
    },
  });
  if (b === null) return { booking: null };
  const { vehicle, ...booking } = b;

  return { booking, vehicle: vehicle };
};

export const getBookingsWithPassenger = async () => {
  const b = await db.booking.findMany({ include: { passenger: true } });
  return { bookings: b };
};

export const getBookingsByVehicleId = async (vehicleId: string) => {
  const b = await db.booking.findMany({
    where: {
      vehicleId,
    },
  });
  return { bookings: b };
};
