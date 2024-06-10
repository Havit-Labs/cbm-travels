import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/vehicles/useOptimisticVehicles";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";





import { type Vehicle, insertVehicleParams } from "@/lib/db/schema/vehicles";
import {
  createVehicleAction,
  deleteVehicleAction,
  updateVehicleAction,
} from "@/lib/actions/vehicles";


const VehicleForm = ({
  
  vehicle,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  vehicle?: Vehicle | null;
  
  openModal?: (vehicle?: Vehicle) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Vehicle>(insertVehicleParams);
  const editing = !!vehicle?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("vehicles");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Vehicle },
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
      toast.success(`Vehicle ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const vehicleParsed = await insertVehicleParams.safeParseAsync({  ...payload });
    if (!vehicleParsed.success) {
      setErrors(vehicleParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = vehicleParsed.data;
    const pendingVehicle: Vehicle = {
      updatedAt: vehicle?.updatedAt ?? new Date(),
      createdAt: vehicle?.createdAt ?? new Date(),
      id: vehicle?.id ?? "",
      ...values,
 
     
      
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingVehicle,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateVehicleAction({ ...values, id: vehicle.id })
          : await createVehicleAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingVehicle 
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
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={vehicle?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.departure ? "text-destructive" : "",
          )}
        >
          Departure
        </Label>
        <Input
          type="text"
          name="departure"
          className={cn(errors?.departure ? "ring ring-destructive" : "")}
          defaultValue={vehicle?.departure ?? ""}
        />
        {errors?.departure ? (
          <p className="text-xs text-destructive mt-2">{errors.departure[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.arrival ? "text-destructive" : "",
          )}
        >
          Arrival
        </Label>
        <Input
          type="text"
          name="arrival"
          className={cn(errors?.arrival ? "ring ring-destructive" : "")}
          defaultValue={vehicle?.arrival ?? ""}
        />
        {errors?.arrival ? (
          <p className="text-xs text-destructive mt-2">{errors.arrival[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.type ? "text-destructive" : "",
          )}
        >
          Type
        </Label>
        <Input
          type="text"
          name="type"
          className={cn(errors?.type ? "ring ring-destructive" : "")}
          defaultValue={vehicle?.type ?? ""}
        />
        {errors?.type ? (
          <p className="text-xs text-destructive mt-2">{errors.type[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.price ? "text-destructive" : "",
          )}
        >
          Price
        </Label>
        <Input
          type="text"
          name="price"
          className={cn(errors?.price ? "ring ring-destructive" : "")}
          defaultValue={vehicle?.price ?? ""}
        />
        {errors?.price ? (
          <p className="text-xs text-destructive mt-2">{errors.price[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.capacity ? "text-destructive" : "",
          )}
        >
          Capacity
        </Label>
        <Input
          type="text"
          name="capacity"
          className={cn(errors?.capacity ? "ring ring-destructive" : "")}
          defaultValue={vehicle?.capacity ?? ""}
        />
        {errors?.capacity ? (
          <p className="text-xs text-destructive mt-2">{errors.capacity[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
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
              addOptimistic && addOptimistic({ action: "delete", data: vehicle });
              const error = await deleteVehicleAction(vehicle.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: vehicle,
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

export default VehicleForm;

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
