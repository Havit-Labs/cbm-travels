import { vehicleSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getVehicles } from "@/lib/api/vehicles/queries";


// Schema for vehicles - used to validate API requests
const baseSchema = vehicleSchema.omit(timestamps)

export const insertVehicleSchema = baseSchema.omit({ id: true });
export const insertVehicleParams = baseSchema.extend({
  price: z.coerce.number(),
  capacity: z.coerce.number()
}).omit({ 
  id: true
});

export const updateVehicleSchema = baseSchema;
export const updateVehicleParams = updateVehicleSchema.extend({
  price: z.coerce.number(),
  capacity: z.coerce.number()
})
export const vehicleIdSchema = baseSchema.pick({ id: true });

// Types for vehicles - used to type API request params and within Components
export type Vehicle = z.infer<typeof vehicleSchema>;
export type NewVehicle = z.infer<typeof insertVehicleSchema>;
export type NewVehicleParams = z.infer<typeof insertVehicleParams>;
export type UpdateVehicleParams = z.infer<typeof updateVehicleParams>;
export type VehicleId = z.infer<typeof vehicleIdSchema>["id"];
    
// this type infers the return from getVehicles() - meaning it will include any joins
export type CompleteVehicle = Awaited<ReturnType<typeof getVehicles>>["vehicles"][number];

