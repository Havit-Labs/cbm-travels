import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingState {
  selectedSeats: number[];
  addSeat: (seat: number) => void;
  removeSeat: (seat: number) => void;
  clearSeats: () => void;
  vehicleId: string;
  setVehicleId: (vehicleId: string) => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      selectedSeats: [],
      setVehicleId: (vehicleId) => set({ vehicleId }),
      clearSeats: () => set({ selectedSeats: [] }),
      vehicleId: "",
      addSeat: (seat) =>
        set((state) => {
          if (!state.selectedSeats.includes(seat)) {
            return { selectedSeats: [...state.selectedSeats, seat] };
          }
          return state;
        }),
      removeSeat: (seat) =>
        set((state) => ({
          selectedSeats: state.selectedSeats.filter((s) => s !== seat),
        })),
    }),
    {
      name: "booking-storage",
     
    }
  )
);
