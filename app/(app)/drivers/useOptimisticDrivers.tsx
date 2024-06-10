import { type Vehicle } from "@/lib/db/schema/vehicles";
import { type Driver, type CompleteDriver } from "@/lib/db/schema/drivers";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Driver>) => void;

export const useOptimisticDrivers = (
  drivers: CompleteDriver[],
  vehicles: Vehicle[]
) => {
  const [optimisticDrivers, addOptimisticDriver] = useOptimistic(
    drivers,
    (
      currentState: CompleteDriver[],
      action: OptimisticAction<Driver>,
    ): CompleteDriver[] => {
      const { data } = action;

      const optimisticVehicle = vehicles.find(
        (vehicle) => vehicle.id === data.vehicleId,
      )!;

      const optimisticDriver = {
        ...data,
        vehicle: optimisticVehicle,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticDriver]
            : [...currentState, optimisticDriver];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticDriver } : item,
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

  return { addOptimisticDriver, optimisticDrivers };
};
