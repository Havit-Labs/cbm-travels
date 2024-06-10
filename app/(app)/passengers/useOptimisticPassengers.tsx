import { type Booking } from "@/lib/db/schema/bookings";
import { type Passenger, type CompletePassenger } from "@/lib/db/schema/passengers";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Passenger>) => void;

export const useOptimisticPassengers = (
  passengers: CompletePassenger[],
  bookings: Booking[]
) => {
  const [optimisticPassengers, addOptimisticPassenger] = useOptimistic(
    passengers,
    (
      currentState: CompletePassenger[],
      action: OptimisticAction<Passenger>,
    ): CompletePassenger[] => {
      const { data } = action;

      const optimisticBooking = bookings.find(
        (booking) => booking.id === data.bookingId,
      )!;

      const optimisticPassenger = {
        ...data,
        booking: optimisticBooking,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticPassenger]
            : [...currentState, optimisticPassenger];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticPassenger } : item,
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

  return { addOptimisticPassenger, optimisticPassengers };
};
