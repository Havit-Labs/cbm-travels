import { passengerSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getPassengers } from "@/lib/api/passengers/queries";


// Schema for passengers - used to validate API requests
const baseSchema = passengerSchema.omit(timestamps)

export const insertPassengerSchema = baseSchema.omit({ id: true });
export const insertPassengerParams = baseSchema.extend({
  bookingId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updatePassengerSchema = baseSchema;
export const updatePassengerParams = updatePassengerSchema.extend({
  bookingId: z.coerce.string().min(1)
})
export const passengerIdSchema = baseSchema.pick({ id: true });

// Types for passengers - used to type API request params and within Components
export type Passenger = z.infer<typeof passengerSchema>;
export type NewPassenger = z.infer<typeof insertPassengerSchema>;
export type NewPassengerParams = z.infer<typeof insertPassengerParams>;
export type UpdatePassengerParams = z.infer<typeof updatePassengerParams>;
export type PassengerId = z.infer<typeof passengerIdSchema>["id"];
    
// this type infers the return from getPassengers() - meaning it will include any joins
export type CompletePassenger = Awaited<ReturnType<typeof getPassengers>>["passengers"][number];

