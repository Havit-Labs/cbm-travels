import { BookTicketForm } from "@/components/bookings/BookTripForm";
import { getVehicles } from "@/lib/api/vehicles/queries";

export default async function CreateBooking({
  searchParams,
}: {
  searchParams: any;
}) {
  const { d, a } = searchParams;
  const { vehicles } = await getVehicles({
    departure:d,
    arrival:a
  });
  return (
    <div>
        <BookTicketForm />
      <pre>
        {JSON.stringify(vehicles, null, 2)}
      </pre>
    </div>
  );
}
