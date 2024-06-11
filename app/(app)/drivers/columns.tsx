"use client";

import { ColumnDef } from "@tanstack/react-table";

import { SquareArrowOutUpRight, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { CompleteDriver } from "@/lib/db/schema/drivers";
import { usePathname } from "next/navigation";

export const columns: ColumnDef<CompleteDriver>[] = [
  {
    accessorKey: "name",
    header: "Vehicle",
    cell: ({ row }) => {
      const {
        vehicle: { id },
      } = row.original;

      return (
        <Link
          href={`/vehicles/${id}`}
          className="underline flex items-center gap-1"
        >
          {id}
          <SquareArrowOutUpRight size={10} />
        </Link>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;

      return firstName + " " + lastName;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const { createdAt } = row.original;

      return new Date(createdAt).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const driver = row.original;
      const pathname = usePathname();
      const basePath = pathname.includes("drivers")
        ? pathname
        : pathname + "/drivers/";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link href={basePath + "/" + driver.id}>
              <DropdownMenuItem> View</DropdownMenuItem>
            </Link>

            <Link href={basePath + "/" + driver.id}>
              <DropdownMenuItem> Edit</DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
