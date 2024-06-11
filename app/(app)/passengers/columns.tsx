"use client"

import { CompletePassenger } from "@/lib/db/schema/passengers"
import { ColumnDef } from "@tanstack/react-table"

 


export const columns: ColumnDef<CompletePassenger>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
     const {firstName, lastName} = row.original;
 
      return firstName + " " + lastName;
    },
  },
  {
    accessorKey: "booking.paymentType",
    header: "Payment Type",
  },
  {
    accessorKey: "booking.seatNumber",
    header: "Seat(s)",
  },
  {
    accessorKey: "sex",
    header: "Gender",
  },
  {
    accessorKey: "booking.vehicle.departure",
    header: "Departure",
  },
  {
    accessorKey: "booking.vehicle.arrival",
    header: "Arrival",
  },
  {
    accessorKey: "booking.createdAt",
    header: "Booking Date",
    cell: ({ row }) => {
      const {booking} = row.original;
  
       return new Date(booking.createdAt).toLocaleDateString();
     },
  },

]
