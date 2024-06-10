import { nextOfKinSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getNextOfKin } from "@/lib/api/nextOfKin/queries";


// Schema for nextOfKin - used to validate API requests
const baseSchema = nextOfKinSchema.omit(timestamps)

export const insertNextOfKinSchema = baseSchema.omit({ id: true });
export const insertNextOfKinParams = baseSchema.extend({
  passengerId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateNextOfKinSchema = baseSchema;
export const updateNextOfKinParams = updateNextOfKinSchema.extend({
  passengerId: z.coerce.string().min(1)
})
export const nextOfKinIdSchema = baseSchema.pick({ id: true });

// Types for nextOfKin - used to type API request params and within Components
export type NextOfKin = z.infer<typeof nextOfKinSchema>;
export type NewNextOfKin = z.infer<typeof insertNextOfKinSchema>;
export type NewNextOfKinParams = z.infer<typeof insertNextOfKinParams>;
export type UpdateNextOfKinParams = z.infer<typeof updateNextOfKinParams>;
export type NextOfKinId = z.infer<typeof nextOfKinIdSchema>["id"];
    
// this type infers the return from getNextOfKin() - meaning it will include any joins
export type CompleteNextOfKin = Awaited<ReturnType<typeof getNextOfKin>>["nextOfKin"][number];

