import * as z from "zod"
import { CompleteVehicle, relatedVehicleSchema, CompleteNextOfKin, relatedNextOfKinSchema } from "./index"

export const driverSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  address: z.string().nullish(),
  licenseNumber: z.string().nullish(),
  vehicleId: z.string(),
  resumptionDate: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteDriver extends z.infer<typeof driverSchema> {
  vehicle: CompleteVehicle
  nextOfKin?: CompleteNextOfKin | null
}

/**
 * relatedDriverSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedDriverSchema: z.ZodSchema<CompleteDriver> = z.lazy(() => driverSchema.extend({
  vehicle: relatedVehicleSchema,
  nextOfKin: relatedNextOfKinSchema.nullish(),
}))
