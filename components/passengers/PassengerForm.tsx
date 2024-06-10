import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/passengers/useOptimisticPassengers";

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

import { type Passenger, insertPassengerParams } from "@/lib/db/schema/passengers";
import {
  createPassengerAction,
  deletePassengerAction,
  updatePassengerAction,
} from "@/lib/actions/passengers";
import { type Booking, type BookingId } from "@/lib/db/schema/bookings";

const PassengerForm = ({
  bookings,
  bookingId,
  passenger,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  passenger?: Passenger | null;
  bookings: Booking[];
  bookingId?: BookingId
  openModal?: (passenger?: Passenger) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Passenger>(insertPassengerParams);
  const editing = !!passenger?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("passengers");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Passenger },
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
      toast.success(`Passenger ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const passengerParsed = await insertPassengerParams.safeParseAsync({ bookingId, ...payload });
    if (!passengerParsed.success) {
      setErrors(passengerParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = passengerParsed.data;
    const pendingPassenger: Passenger = {
      updatedAt: passenger?.updatedAt ?? new Date(),
      createdAt: passenger?.createdAt ?? new Date(),
      id: passenger?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingPassenger,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updatePassengerAction({ ...values, id: passenger.id })
          : await createPassengerAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingPassenger 
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
            errors?.firstName ? "text-destructive" : "",
          )}
        >
          First Name
        </Label>
        <Input
          type="text"
          name="firstName"
          className={cn(errors?.firstName ? "ring ring-destructive" : "")}
          defaultValue={passenger?.firstName ?? ""}
        />
        {errors?.firstName ? (
          <p className="text-xs text-destructive mt-2">{errors.firstName[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.lastName ? "text-destructive" : "",
          )}
        >
          Last Name
        </Label>
        <Input
          type="text"
          name="lastName"
          className={cn(errors?.lastName ? "ring ring-destructive" : "")}
          defaultValue={passenger?.lastName ?? ""}
        />
        {errors?.lastName ? (
          <p className="text-xs text-destructive mt-2">{errors.lastName[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.sex ? "text-destructive" : "",
          )}
        >
          Sex
        </Label>
        <Input
          type="text"
          name="sex"
          className={cn(errors?.sex ? "ring ring-destructive" : "")}
          defaultValue={passenger?.sex ?? ""}
        />
        {errors?.sex ? (
          <p className="text-xs text-destructive mt-2">{errors.sex[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.passengerType ? "text-destructive" : "",
          )}
        >
          Passenger Type
        </Label>
        <Input
          type="text"
          name="passengerType"
          className={cn(errors?.passengerType ? "ring ring-destructive" : "")}
          defaultValue={passenger?.passengerType ?? ""}
        />
        {errors?.passengerType ? (
          <p className="text-xs text-destructive mt-2">{errors.passengerType[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.phone ? "text-destructive" : "",
          )}
        >
          Phone
        </Label>
        <Input
          type="text"
          name="phone"
          className={cn(errors?.phone ? "ring ring-destructive" : "")}
          defaultValue={passenger?.phone ?? ""}
        />
        {errors?.phone ? (
          <p className="text-xs text-destructive mt-2">{errors.phone[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {bookingId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.bookingId ? "text-destructive" : "",
          )}
        >
          Booking
        </Label>
        <Select defaultValue={passenger?.bookingId} name="bookingId">
          <SelectTrigger
            className={cn(errors?.bookingId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a booking" />
          </SelectTrigger>
          <SelectContent>
          {bookings?.map((booking) => (
            <SelectItem key={booking.id} value={booking.id.toString()}>
              {booking.id}{/* TODO: Replace with a field from the booking model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.bookingId ? (
          <p className="text-xs text-destructive mt-2">{errors.bookingId[0]}</p>
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
              addOptimistic && addOptimistic({ action: "delete", data: passenger });
              const error = await deletePassengerAction(passenger.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: passenger,
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

export default PassengerForm;

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
