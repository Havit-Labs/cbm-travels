import { driverSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getDrivers } from "@/lib/api/drivers/queries";


// Schema for drivers - used to validate API requests
const baseSchema = driverSchema.omit(timestamps)

export const insertDriverSchema = baseSchema.omit({ id: true });
export const insertDriverParams = baseSchema.extend({
  vehicleId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateDriverSchema = baseSchema;
export const updateDriverParams = updateDriverSchema.extend({
  vehicleId: z.coerce.string().min(1)
})
export const driverIdSchema = baseSchema.pick({ id: true });

// Types for drivers - used to type API request params and within Components
export type Driver = z.infer<typeof driverSchema>;
export type NewDriver = z.infer<typeof insertDriverSchema>;
export type NewDriverParams = z.infer<typeof insertDriverParams>;
export type UpdateDriverParams = z.infer<typeof updateDriverParams>;
export type DriverId = z.infer<typeof driverIdSchema>["id"];
    
// this type infers the return from getDrivers() - meaning it will include any joins
export type CompleteDriver = Awaited<ReturnType<typeof getDrivers>>["drivers"][number];

