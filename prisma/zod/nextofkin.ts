import * as z from "zod"
import { CompletePassenger, relatedPassengerSchema, CompleteDriver, relatedDriverSchema } from "./index"

export const nextOfKinSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  phoneNumber: z.string(),
  driverId: z.string().nullish(),
  passengerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteNextOfKin extends z.infer<typeof nextOfKinSchema> {
  passenger?: CompletePassenger | null
  driver?: CompleteDriver | null
}

/**
 * relatedNextOfKinSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedNextOfKinSchema: z.ZodSchema<CompleteNextOfKin> = z.lazy(() => nextOfKinSchema.extend({
  passenger: relatedPassengerSchema.nullish(),
  driver: relatedDriverSchema.nullish(),
}))
