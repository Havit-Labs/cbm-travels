import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/drivers/useOptimisticDrivers";

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

import { type Driver, insertDriverParams } from "@/lib/db/schema/drivers";
import {
  createDriverAction,
  deleteDriverAction,
  updateDriverAction,
} from "@/lib/actions/drivers";
import { type Vehicle, type VehicleId } from "@/lib/db/schema/vehicles";

const DriverForm = ({
  vehicles,
  vehicleId,
  driver,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  driver?: Driver | null;
  vehicles: Vehicle[];
  vehicleId?: VehicleId
  openModal?: (driver?: Driver) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Driver>(insertDriverParams);
  const editing = !!driver?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("drivers");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Driver },
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
      toast.success(`Driver ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const driverParsed = await insertDriverParams.safeParseAsync({ vehicleId, ...payload });
    if (!driverParsed.success) {
      setErrors(driverParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = driverParsed.data;
    const pendingDriver: Driver = {
      updatedAt: driver?.updatedAt ?? new Date(),
      createdAt: driver?.createdAt ?? new Date(),
      id: driver?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingDriver,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateDriverAction({ ...values, id: driver.id })
          : await createDriverAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingDriver 
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
          defaultValue={driver?.firstName ?? ""}
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
          defaultValue={driver?.lastName ?? ""}
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
            errors?.email ? "text-destructive" : "",
          )}
        >
          Email
        </Label>
        <Input
          type="text"
          name="email"
          className={cn(errors?.email ? "ring ring-destructive" : "")}
          defaultValue={driver?.email ?? ""}
        />
        {errors?.email ? (
          <p className="text-xs text-destructive mt-2">{errors.email[0]}</p>
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
          defaultValue={driver?.phone ?? ""}
        />
        {errors?.phone ? (
          <p className="text-xs text-destructive mt-2">{errors.phone[0]}</p>
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
        <Select defaultValue={driver?.vehicleId} name="vehicleId">
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
              addOptimistic && addOptimistic({ action: "delete", data: driver });
              const error = await deleteDriverAction(driver.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: driver,
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

export default DriverForm;

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
