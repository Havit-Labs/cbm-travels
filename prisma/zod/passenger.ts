import * as z from "zod"
import { CompleteBooking, relatedBookingSchema, CompleteNextOfKin, relatedNextOfKinSchema } from "./index"

export const passengerSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  sex: z.string(),
  passengerType: z.string(),
  phone: z.string(),
  bookingId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePassenger extends z.infer<typeof passengerSchema> {
  booking: CompleteBooking
  nextOfKin: CompleteNextOfKin[]
}

/**
 * relatedPassengerSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedPassengerSchema: z.ZodSchema<CompletePassenger> = z.lazy(() => passengerSchema.extend({
  booking: relatedBookingSchema,
  nextOfKin: relatedNextOfKinSchema.array(),
}))
