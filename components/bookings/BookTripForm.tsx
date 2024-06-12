"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ARRIVALS from "@/constants/unique_arrivals.json";
import DEPARTURES from "@/constants/unique_departures.json";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function BookTicketForm() {
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
      <h1 className="py-2 font-bold text-xl">Create Booking</h1>
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
        </Select>
      </div>
    </div>
  );
}
