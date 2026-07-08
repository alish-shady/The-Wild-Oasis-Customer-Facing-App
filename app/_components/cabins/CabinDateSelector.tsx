"use client";

import { getBookedDatesByCabinId } from "@/app/_lib/data-service";
import { useAppDispatch, useAppSelector } from "@/app/_lib/hooks";
import "@daypicker/react/style.css";
import { DateRange, DayPicker, isDateRange } from "react-day-picker";
import { Settings } from "../../../types/settings";
import { Cabin } from "../../../types/cabin";
import { addRange, clearRange, selectReservationDateRange } from "@/app/_lib/slices/reservationSlice";
import { differenceInDays, isPast, isSameDay, isWithinInterval } from "date-fns";

type BookedDates = Awaited<ReturnType<typeof getBookedDatesByCabinId>>;

type CabinDateSelectorProps = {
  bookedDates: BookedDates;
  settings: Settings;
  cabin: Cabin;
};

export default function CabinDateSelector({ bookedDates, settings, cabin }: CabinDateSelectorProps) {
  const { regularPrice, discount, id } = cabin;
  const { minBookingLength, maxBookingLength } = settings;
  const today = new Date();
  const dispatch = useAppDispatch();
  const range = useAppSelector(selectReservationDateRange);
  const displayRange = range?.cabinId === id ? range : { from: undefined, to: undefined };
  const numNights = range?.to && range.from ? differenceInDays(range.to, range.from) : 0;
  const cabinPrice = numNights * (regularPrice - discount);
  function handleSelect(data: DateRange | undefined) {
    if (!isDateRange(data)) return;
    const { from, to } = data;
    if (!from || !to) {
      dispatch(addRange(data, id));
      return;
    }
    const isAlreadyBooked = bookedDates.some((bookedDate) =>
      isWithinInterval(bookedDate, {
        start: from,
        end: to,
      }),
    );
    if (!isAlreadyBooked) {
      dispatch(addRange(data, id));
    }
  }
  return (
    <div className="flex flex-col justify-between items-center">
      <DayPicker
        className="p-4"
        mode="range"
        onSelect={handleSelect}
        selected={displayRange}
        min={minBookingLength}
        max={maxBookingLength}
        startMonth={today}
        endMonth={new Date(today.getFullYear() + 5, 11)}
        disabled={(curDate) => isPast(curDate) || bookedDates.some((date) => isSameDay(date, curDate))}
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
            <span>/night</span>
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
            className="border border-primary-800 py-2 px-4 text-sm font-semibold ml-4"
            onClick={() => dispatch(clearRange())}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
