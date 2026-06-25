"use client";

import { getBookedDatesByCabinId } from "@/app/_lib/data-service";
import { useAppDispatch, useAppSelector } from "@/app/_lib/hooks";
import "@daypicker/react/style.css";
import { DateRange, DayPicker, isDateRange } from "react-day-picker";
import { Settings } from "../account/settings";
import { Cabin } from "./cabin";
import { addRange, clearRange, selectReservationDateRange } from "@/app/_lib/slices/reservationSlice";

type BookedDates = Awaited<ReturnType<typeof getBookedDatesByCabinId>>;

type CabinDateSelectorProps = {
  bookedDates: BookedDates;
  settings: Settings;
  cabin: Cabin;
};

// function isAlreadyBooked(range, datesArr) {
//   return (
//     range.from && range.to && datesArr.some((date) => isWithinInterval(date, { start: range.from, end: range.to }))
//   );
// }

export default function CabinDateSelector({ bookedDates, settings, cabin }: CabinDateSelectorProps) {
  const regularPrice = 23;
  const discount = 23;
  const numNights = 23;
  const cabinPrice = 23;
  const { minBookingLength, maxBookingLength } = settings;
  const today = new Date();
  const dispatch = useAppDispatch();
  const range = useAppSelector(selectReservationDateRange);
  function handleSelect(data: DateRange | undefined) {
    if (isDateRange(data)) dispatch(addRange(data));
  }
  return (
    <div className="flex flex-col justify-between items-center">
      <DayPicker
        className="p-4"
        mode="range"
        onSelect={handleSelect}
        selected={range}
        min={minBookingLength}
        max={maxBookingLength}
        startMonth={today}
        endMonth={new Date(today.getFullYear() + 5, 11)}
        disabled={{ before: today }}
        captionLayout="dropdown"
        navLayout="after"
        numberOfMonths={2}
      />
      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-18">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">${regularPrice}</span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={() => dispatch(clearRange())}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
