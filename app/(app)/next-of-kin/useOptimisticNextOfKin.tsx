import { type Passenger } from "@/lib/db/schema/passengers";
import { type NextOfKin, type CompleteNextOfKin } from "@/lib/db/schema/nextOfKin";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<NextOfKin>) => void;

export const useOptimisticNextOfKins = (
  nextOfKin: CompleteNextOfKin[],
  passengers: Passenger[]
) => {
  const [optimisticNextOfKins, addOptimisticNextOfKin] = useOptimistic(
    nextOfKin,
    (
      currentState: CompleteNextOfKin[],
      action: OptimisticAction<NextOfKin>,
    ): CompleteNextOfKin[] => {
      const { data } = action;

      const optimisticPassenger = passengers.find(
        (passenger) => passenger.id === data.passengerId,
      )!;

      const optimisticNextOfKin = {
        ...data,
        passenger: optimisticPassenger,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticNextOfKin]
            : [...currentState, optimisticNextOfKin];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticNextOfKin } : item,
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

  return { addOptimisticNextOfKin, optimisticNextOfKins };
};
