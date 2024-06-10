"use client"

import { CompleteBooking } from "@/lib/db/schema/bookings"
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
    accessorKey: "booking.paymentType",
    header: "Seat(s)",
  },
  {
    accessorKey: "booking.paymentType",
    header: "Gender",
  },
  {
    accessorKey: "booking.paymentType",
    header: "Departure",
  },
  {
    accessorKey: "booking.paymentType",
    header: "Arrival",
  },
  {
    accessorKey: "Booking Date",
    header: "Booking Date",
  },
]
