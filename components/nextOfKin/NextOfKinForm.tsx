import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/next-of-kin/useOptimisticNextOfKin";

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

import { type NextOfKin, insertNextOfKinParams } from "@/lib/db/schema/nextOfKin";
import {
  createNextOfKinAction,
  deleteNextOfKinAction,
  updateNextOfKinAction,
} from "@/lib/actions/nextOfKin";
import { type Passenger, type PassengerId } from "@/lib/db/schema/passengers";

const NextOfKinForm = ({
  passengers,
  passengerId,
  nextOfKin,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  nextOfKin?: NextOfKin | null;
  passengers: Passenger[];
  passengerId?: PassengerId
  openModal?: (nextOfKin?: NextOfKin) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<NextOfKin>(insertNextOfKinParams);
  const editing = !!nextOfKin?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("next-of-kin");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: NextOfKin },
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
      toast.success(`NextOfKin ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const nextOfKinParsed = await insertNextOfKinParams.safeParseAsync({ passengerId, ...payload });
    if (!nextOfKinParsed.success) {
      setErrors(nextOfKinParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = nextOfKinParsed.data;
    const pendingNextOfKin: NextOfKin = {
      updatedAt: nextOfKin?.updatedAt ?? new Date(),
      createdAt: nextOfKin?.createdAt ?? new Date(),
      id: nextOfKin?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingNextOfKin,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateNextOfKinAction({ ...values, id: nextOfKin.id })
          : await createNextOfKinAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingNextOfKin 
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
            errors?.fullName ? "text-destructive" : "",
          )}
        >
          Full Name
        </Label>
        <Input
          type="text"
          name="fullName"
          className={cn(errors?.fullName ? "ring ring-destructive" : "")}
          defaultValue={nextOfKin?.fullName ?? ""}
        />
        {errors?.fullName ? (
          <p className="text-xs text-destructive mt-2">{errors.fullName[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.phoneNumber ? "text-destructive" : "",
          )}
        >
          Phone Number
        </Label>
        <Input
          type="text"
          name="phoneNumber"
          className={cn(errors?.phoneNumber ? "ring ring-destructive" : "")}
          defaultValue={nextOfKin?.phoneNumber ?? ""}
        />
        {errors?.phoneNumber ? (
          <p className="text-xs text-destructive mt-2">{errors.phoneNumber[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {passengerId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.passengerId ? "text-destructive" : "",
          )}
        >
          Passenger
        </Label>
        <Select defaultValue={nextOfKin?.passengerId} name="passengerId">
          <SelectTrigger
            className={cn(errors?.passengerId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a passenger" />
          </SelectTrigger>
          <SelectContent>
          {passengers?.map((passenger) => (
            <SelectItem key={passenger.id} value={passenger.id.toString()}>
              {passenger.id}{/* TODO: Replace with a field from the passenger model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.passengerId ? (
          <p className="text-xs text-destructive mt-2">{errors.passengerId[0]}</p>
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
              addOptimistic && addOptimistic({ action: "delete", data: nextOfKin });
              const error = await deleteNextOfKinAction(nextOfKin.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: nextOfKin,
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

export default NextOfKinForm;

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
