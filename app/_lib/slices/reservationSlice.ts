import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { DateRange } from "react-day-picker";
type ReservationState = {
  from?: string;
  to?: string;
};
const initialState: ReservationState | undefined = { from: undefined, to: undefined };
const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    addRange: {
      reducer(state, action: PayloadAction<{ from: string; to?: string } | undefined>) {
        if (!action.payload) return;
        state.from = action.payload.from;
        state.to = action.payload.to;
      },
      prepare(range: DateRange | undefined) {
        if (!range?.from) {
          return { payload: undefined };
        }
        return {
          payload: {
            from: range.from.toISOString(),
            to: range.to?.toISOString(),
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

export const selectReservationDateRange = createSelector([selectReservation], (reservation): DateRange | undefined => {
  if (!reservation.from) return undefined;

  return {
    from: new Date(reservation.from),
    to: reservation.to ? new Date(reservation.to) : undefined,
  };
});
export const { addRange, clearRange } = reservationSlice.actions;
export default reservationSlice.reducer;
