
import { type Vehicle, type CompleteVehicle } from "@/lib/db/schema/vehicles";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Vehicle>) => void;

export const useOptimisticVehicles = (
  vehicles: CompleteVehicle[],
  
) => {
  const [optimisticVehicles, addOptimisticVehicle] = useOptimistic(
    vehicles,
    (
      currentState: CompleteVehicle[],
      action: OptimisticAction<Vehicle>,
    ): CompleteVehicle[] => {
      const { data } = action;

      

      const optimisticVehicle = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticVehicle]
            : [...currentState, optimisticVehicle];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticVehicle } : item,
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

  return { addOptimisticVehicle, optimisticVehicles };
};
