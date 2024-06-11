import { PrismaClient } from "@prisma/client";
import vehicles from "@/constants/cbm.vehicles.json"

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var db: PrismaClient | undefined;
}

export const db =
  global.db ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.db = db;



// vehicles.forEach(async(v) => {
//   delete v.__v
//   delete v._id
//   delete v.driver
//   delete v.seatsData
//   delete v.createdAt
//   delete v.updatedAt

//   await db.vehicle.create({
//     data: v})
// })