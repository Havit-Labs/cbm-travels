"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DEPARTURES from "@/constants/unique_departures.json";
import ARRIVALS from "@/constants/unique_arrivals.json";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  depparture: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  arrival: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  language: z.string({
    required_error: "Please select a language.",
  }),
});

export function BookTicketForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  function handleSearch(key: string, term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(key, term);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  }
 

  return (
    <div>
        <div className="grid grid-cols-2 gap-4">

    
      <Select onValueChange={(val) => handleSearch("d", val)}>
        <SelectTrigger>
          <SelectValue
            defaultValue={searchParams.get("d")?.toString()}
            placeholder="Select Departure"
          />
        </SelectTrigger>

        <SelectContent>
          {DEPARTURES.map((val, key) => (
            <SelectItem key={key} value={val}>
              {val}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(val) => handleSearch("a", val)}>
        <SelectTrigger>
          <SelectValue
            defaultValue={searchParams.get("a")?.toString()}
            placeholder="Select Arrival"
          />
        </SelectTrigger>

        <SelectContent>
          {ARRIVALS.map((val, key) => (
            <SelectItem key={key} value={val}>
              {val}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>    </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
