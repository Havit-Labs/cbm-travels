import { Vehicle } from "@/lib/db/schema/vehicles";
import { Button } from "../ui/button";

export const SelectSeat = ({ vehicle }: { vehicle: Vehicle }) => {
    
  return (
    <div>
      <p>Select seat</p>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: vehicle.capacity }, (_, index) => (
          <Button key={index}>{index + 1}</Button>
        ))}
      </div>
    </div>
  );
};
