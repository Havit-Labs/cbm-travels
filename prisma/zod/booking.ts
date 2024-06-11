import * as z from "zod"
import { CompleteVehicle, relatedVehicleSchema, CompletePassenger, relatedPassengerSchema } from "./index"

export const bookingSchema = z.object({
  id: z.string(),
  paymentType: z.string(),
  seatNumber: z.string(),
  discount: z.string().nullish(),
  amountPaid: z.number().int(),
  vehicleId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteBooking extends z.infer<typeof bookingSchema> {
  vehicle: CompleteVehicle
  passenger?: CompletePassenger | null
}

/**
 * relatedBookingSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedBookingSchema: z.ZodSchema<CompleteBooking> = z.lazy(() => bookingSchema.extend({
  vehicle: relatedVehicleSchema,
  passenger: relatedPassengerSchema.nullish(),
}))
