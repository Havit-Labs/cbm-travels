import { Vehicle } from "@/lib/db/schema/vehicles";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Booking } from "@/lib/db/schema/bookings";

type Props = {
  componentRef: any;
  responses: any;
  vehicle: Vehicle;
  savedBooking: Booking;
};
export const Receipt = ({
  componentRef,
  responses,
  vehicle,
  savedBooking,
}: Props) => {
  return (
    <div ref={componentRef} className="hidden print:block grid grid-cols-1 ">
      <p className="text-center">ww.travelcbn.com</p>
      <p className="text-center">
        Booking Receipt {new Date().toISOString().slice(0, 10)}
      </p>
      <div className="grid grid-cols-2 gap-14">
        <div className="space-y-2 px-10">
          <h1 className="pt-6">Passenger Details</h1>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>First Name</Label>

            <Input defaultValue={responses?.passenger?.firstName} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Last Name</Label>
            <Input defaultValue={responses?.passenger?.lastName} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Gender</Label>
            <Input
              type="text"
              id="email"
              defaultValue={responses?.passenger?.sex}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Passenger Type</Label>
            <Input defaultValue={responses?.passenger?.passengerType} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Passenger Phone</Label>

            <Input defaultValue={responses?.passenger?.phone} />
          </div>
          <h1 className="pt-6">Next of Kin's Details</h1>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">First Name</Label>

            <Input defaultValue={responses?.nextOfKin?.fullName} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Phone</Label>
            <Input defaultValue={responses?.nextOfKin?.phoneNumber} />
          </div>
        </div>
        <table className="h-max my-4 ">
          <tr>
            <td>From</td>
            <td>{vehicle.departure}</td>
          </tr>
          <tr>
            <td>To</td>
            <td>{vehicle.arrival}</td>
          </tr>
          <tr>
            <td>Date</td>
            <td>
              {new Date(savedBooking?.createdAt || "").toLocaleDateString()}
            </td>
          </tr>
          <tr>
            <td>Adult(s)</td>
            <td>{0}</td>
          </tr>
          <tr>
            <td>Children</td>
            <td>{0}</td>
          </tr>

          <tr>
            <td>Seat number(s)</td>
            <td>{savedBooking?.seatNumber}</td>
          </tr>
          <tr>
            <td>Total Amount</td>
            <td>{savedBooking?.amountPaid}</td>
          </tr>
        </table>
      </div>
      <p className="text-center pt-4">
        For enquires please call: 08037015262, 09035913402, 09030544531
      </p>
      <p className="text-center">
        Please note that there is no refund of money after payment Ticket not
        transferable. Ticket valid for 1 trip.
      </p>
    </div>
  );
};
