"use client"

import { CompleteBooking } from "@/lib/db/schema/bookings"
import { ColumnDef } from "@tanstack/react-table"


export const columns: ColumnDef<CompleteBooking>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "paymentType",
    header: "Payment Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
