import Loading from "@/app/loading";
import { BookTicketForm } from "@/components/bookings/BookTripForm";
import { SelectVehicle } from "@/components/bookings/SelectVehicle";
import { Button } from "@/components/ui/button";
import { getBookingsByVehicleId } from "@/lib/api/bookings/queries";
import { getVehiclesWithParams } from "@/lib/api/vehicles/queries";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";

export default async function CreateBooking({
  searchParams,
}: {
  searchParams: any;
}) {
  const { d, a, vId } = searchParams;
  const { vehicles } = await getVehiclesWithParams({
    departure: d,
    arrival: a,
  });
  const { bookings } = await getBookingsByVehicleId(vId);

  return (
    <div className="space-y-4 ">
      <BookTicketForm />
      <Suspense fallback={<Loading />}>
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 w-full">
            {vehicles.map((v, i) => (
              <SelectVehicle key={i} vehicle={v} bookings={bookings} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 w-full">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
              No vehicles for {d} &gt; {a}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by creating a new vehicle.
            </p>
            <div className="mt-6">
              <Button>
                <PlusIcon className="h-4" /> New Vehicles{" "}
              </Button>
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
}
