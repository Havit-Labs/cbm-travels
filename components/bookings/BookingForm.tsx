import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/bookings/useOptimisticBookings";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";



import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Booking, insertBookingParams } from "@/lib/db/schema/bookings";
import {
  createBookingAction,
  deleteBookingAction,
  updateBookingAction,
} from "@/lib/actions/bookings";
import { type Vehicle, type VehicleId } from "@/lib/db/schema/vehicles";

const BookingForm = ({
  vehicles,
  vehicleId,
  booking,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  booking?: Booking | null;
  vehicles: Vehicle[];
  vehicleId?: VehicleId
  openModal?: (booking?: Booking) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Booking>(insertBookingParams);
  const editing = !!booking?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("bookings");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Booking },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Booking ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const bookingParsed = await insertBookingParams.safeParseAsync({ vehicleId, ...payload });
    if (!bookingParsed.success) {
      setErrors(bookingParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = bookingParsed.data;
    const pendingBooking: Booking = {
      updatedAt: booking?.updatedAt ?? new Date(),
      createdAt: booking?.createdAt ?? new Date(),
      id: booking?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingBooking,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateBookingAction({ ...values, id: booking.id })
          : await createBookingAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingBooking 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.paymentType ? "text-destructive" : "",
          )}
        >
          Payment Type
        </Label>
        <Input
          type="text"
          name="paymentType"
          className={cn(errors?.paymentType ? "ring ring-destructive" : "")}
          defaultValue={booking?.paymentType ?? ""}
        />
        {errors?.paymentType ? (
          <p className="text-xs text-destructive mt-2">{errors.paymentType[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.seatNumber ? "text-destructive" : "",
          )}
        >
          Seat Number
        </Label>
        <Input
          type="text"
          name="seatNumber"
          className={cn(errors?.seatNumber ? "ring ring-destructive" : "")}
          defaultValue={booking?.seatNumber ?? ""}
        />
        {errors?.seatNumber ? (
          <p className="text-xs text-destructive mt-2">{errors.seatNumber[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.discount ? "text-destructive" : "",
          )}
        >
          Discount
        </Label>
        <Input
          type="text"
          name="discount"
          className={cn(errors?.discount ? "ring ring-destructive" : "")}
          defaultValue={booking?.discount ?? ""}
        />
        {errors?.discount ? (
          <p className="text-xs text-destructive mt-2">{errors.discount[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.amountPaid ? "text-destructive" : "",
          )}
        >
          Amount Paid
        </Label>
        <Input
          type="text"
          name="amountPaid"
          className={cn(errors?.amountPaid ? "ring ring-destructive" : "")}
          defaultValue={booking?.amountPaid ?? ""}
        />
        {errors?.amountPaid ? (
          <p className="text-xs text-destructive mt-2">{errors.amountPaid[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {vehicleId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.vehicleId ? "text-destructive" : "",
          )}
        >
          Vehicle
        </Label>
        <Select defaultValue={booking?.vehicleId} name="vehicleId">
          <SelectTrigger
            className={cn(errors?.vehicleId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a vehicle" />
          </SelectTrigger>
          <SelectContent>
          {vehicles?.map((vehicle) => (
            <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
              {vehicle.id}{/* TODO: Replace with a field from the vehicle model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.vehicleId ? (
          <p className="text-xs text-destructive mt-2">{errors.vehicleId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: booking });
              const error = await deleteBookingAction(booking.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: booking,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default BookingForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
