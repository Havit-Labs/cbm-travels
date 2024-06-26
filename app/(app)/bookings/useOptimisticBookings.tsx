import { type Vehicle } from "@/lib/db/schema/vehicles";
import { type Booking, type CompleteBooking } from "@/lib/db/schema/bookings";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Booking>) => void;

export const useOptimisticBookings = (
  bookings: CompleteBooking[],
  vehicles: Vehicle[]
) => {
  const [optimisticBookings, addOptimisticBooking] = useOptimistic(
    bookings,
    (
      currentState: CompleteBooking[],
      action: OptimisticAction<Booking>,
    ): CompleteBooking[] => {
      const { data } = action;

      const optimisticVehicle = vehicles.find(
        (vehicle) => vehicle.id === data.vehicleId,
      )!;

      const optimisticBooking = {
        ...data,
        vehicle: optimisticVehicle,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticBooking]
            : [...currentState, optimisticBooking];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticBooking } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticBooking, optimisticBookings };
};
