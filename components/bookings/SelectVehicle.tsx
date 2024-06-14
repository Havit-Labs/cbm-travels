"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Booking, NewBookingParams } from "@/lib/db/schema/bookings";
import { Vehicle } from "@/lib/db/schema/vehicles";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { z } from "zod";
import Modal from "../shared/Modal";

import { createBooking } from "@/lib/api/bookings/mutations";
import { createNextOfKin } from "@/lib/api/nextOfKin/mutations";
import { createPassenger } from "@/lib/api/passengers/mutations";
import { useBookingStore } from "@/zust/booking.zust";
import { ChevronRight, Loader } from "lucide-react";
import { Input } from "../ui/input";
import { Receipt } from "./Receipt";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  phone: z.string().min(2, {
    message: "Username must be at l`east 2 characters.",
  }),
  next_of_kin_full_name: z.string().min(2, {
    message: "Username must be at l`east 2 characters.",
  }),
  next_of_kin_phone: z.string().min(2, {
    message: "Username must be at l`east 2 characters.",
  }),
  sex: z.string({
    required_error: "Please select a language.",
  }),
  //   passengerType: z.string({
  //     required_error: "Please select a language.",
  //   }),
});

export const SelectVehicle = ({
  vehicle,
  bookings,
}: {
  vehicle: Vehicle;
  bookings: Booking[];
}) => {
  const { selectedSeats, addSeat, removeSeat, clearSeats } = useBookingStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const handleSelect = () => {
    setOpen(true);
    const params = new URLSearchParams(searchParams);
    const vid = params.get("vId");
    if (vid && vid === vehicle.id) {
    } else {
      clearSeats();
      params.set("vId", vehicle.id);
      replace(`${pathname}?${params.toString()}`);
    }
  };
  const seatNumbers = useMemo(() => {
    return bookings.flatMap((item) => item.seatNumber.split(",").map(Number));
  }, [bookings]);

  const handleSeatClick = (seat: number) => {
    if (selectedSeats.includes(seat)) {
      removeSeat(seat);
    } else {
      addSeat(seat);
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [pending, startMutation] = useTransition();
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [responses, setReponses] = useState<any>({});
  const [savedBooking, setSavedBooking] = useState<Booking>({
    seatNumber: "sss",
  } as Booking);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values", values);

    try {
      startMutation(async () => {
        const response = await createBooking({
          paymentType: "CASH",
          amountPaid: vehicle.price,
          vehicleId: vehicle.id,
          seatNumber: selectedSeats.join(","),
        } as NewBookingParams);
        console.log("response", response);
        setSavedBooking(response.booking);

        const passemgerResponse = await createPassenger({
          bookingId: response.booking.id,
          firstName: values.firstName,
          lastName: values.lastName,
          sex: values.sex,
          passengerType: "ADULT",
          phone: values.phone,
        });

        const nextOfKinResponse = await createNextOfKin({
          fullName: values.next_of_kin_full_name,
          phoneNumber: values.next_of_kin_phone,
          passengerId: passemgerResponse.passenger.id,
        });
        console.log("nextOfKinResponse", nextOfKinResponse);
        setReponses({
          passenger: passemgerResponse.passenger,
          nextOfKin: nextOfKinResponse.nextOfKin,
        });
        // push("/print")
        handlePrint();
        setOpen2(false);
      });
    } catch (e) {}
  }

  return (
    <div className="bg-muted rounded-lg p-6 space-y-2">
      <Receipt
        componentRef={componentRef}
        vehicle={vehicle}
        responses={responses}
        savedBooking={savedBooking}
      />
      <h1 className="font-bold text-3xl">{vehicle.type}</h1>
      <div className="flex items-center">
        <p>{vehicle.departure}</p>
        <ChevronRight size={16} />
        <p>{vehicle.arrival}</p>
      </div>
      <p>{vehicle.capacity} seats available</p>
      <p className="font-bold text-2xl">₦ {vehicle.price.toLocaleString()}</p>

      <Button onClick={handleSelect}>Select Seat</Button>
      <Modal open={open} setOpen={setOpen} title="Select Seat(s)">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: vehicle.capacity }, (_, index) => (
              <Button
                onClick={() => handleSeatClick(index + 1)}
                disabled={seatNumbers.includes(index + 1)}
                key={index}
                className={cn(
                  selectedSeats?.includes(index + 1) ? "bg-green-500" : ""
                )}
                variant="outline"
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <Button
            className="w-full"
            onClick={() => {
              setOpen(false);
              setOpen2(true);
            }}
          >
            Continue
          </Button>
        </div>
      </Modal>

      <Modal open={open2} setOpen={setOpen2} title="Passsenger Details">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="doe" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@mail.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="09000000000" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <h1 className="font-bold">Next of Kin</h1>
              <p></p>
              <FormField
                control={form.control}
                name="next_of_kin_full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="John doe" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="next_of_kin_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="09090909090" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={pending} type="submit" className="w-full">
              {pending ? (
                <Loader className="animate-spin" />
              ) : (
                " Submit and Print"
              )}
            </Button>
          </form>
        </Form>
      </Modal>
    </div>
  );
};
