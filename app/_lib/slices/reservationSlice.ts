import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { DateRange } from "react-day-picker";
import { CabinId } from "@/types/cabin";
type ReservationState = {
  from?: string;
  to?: string;
  cabinId?: CabinId;
};
type SelectReservationState = {
  from: Date;
  to?: Date;
  cabinId?: CabinId;
};
const initialState: ReservationState = { from: undefined, to: undefined, cabinId: undefined };
const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    addRange: {
      reducer(state, action: PayloadAction<{ from: string; to?: string; cabinId: CabinId } | undefined>) {
        if (!action.payload) return;
        state.from = action.payload.from;
        state.to = action.payload.to;
        state.cabinId = action.payload.cabinId;
      },
      prepare(range: DateRange | undefined, cabinId: CabinId) {
        if (!range?.from) {
          return { payload: undefined };
        }
        return {
          payload: {
            from: range.from.toISOString(),
            to: range.to?.toISOString(),
            cabinId,
          },
        };
      },
    },
    clearRange() {
      return { from: undefined, to: undefined };
    },
  },
});
const selectReservation = (state: RootState) => state.reservation;

export const selectReservationDateRange = createSelector(
  [selectReservation],
  (reservation): SelectReservationState | undefined => {
    if (!reservation.from) return undefined;
    return {
      from: new Date(reservation.from),
      to: reservation.to ? new Date(reservation.to) : undefined,
      cabinId: reservation.cabinId,
    };
  },
);
export const { addRange, clearRange } = reservationSlice.actions;
export default reservationSlice.reducer;
