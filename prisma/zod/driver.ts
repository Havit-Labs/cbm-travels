import * as z from "zod"
import { CompleteVehicle, relatedVehicleSchema } from "./index"

export const driverSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  vehicleId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteDriver extends z.infer<typeof driverSchema> {
  vehicle: CompleteVehicle
}

/**
 * relatedDriverSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedDriverSchema: z.ZodSchema<CompleteDriver> = z.lazy(() => driverSchema.extend({
  vehicle: relatedVehicleSchema,
}))
