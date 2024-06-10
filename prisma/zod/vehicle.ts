import * as z from "zod"
import { CompleteDriver, relatedDriverSchema, CompleteBooking, relatedBookingSchema } from "./index"

export const vehicleSchema = z.object({
  id: z.string(),
  name: z.string(),
  departure: z.string(),
  arrival: z.string(),
  type: z.string(),
  price: z.number().int(),
  capacity: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteVehicle extends z.infer<typeof vehicleSchema> {
  drivers: CompleteDriver[]
  bookings: CompleteBooking[]
}

/**
 * relatedVehicleSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedVehicleSchema: z.ZodSchema<CompleteVehicle> = z.lazy(() => vehicleSchema.extend({
  drivers: relatedDriverSchema.array(),
  bookings: relatedBookingSchema.array(),
}))
