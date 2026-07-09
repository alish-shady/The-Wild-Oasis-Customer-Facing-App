"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/app/_lib/hooks";
import { clearRange } from "@/app/_lib/slices/reservationSlice";

export default function ClearReservationRange() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearRange());
  }, [dispatch]);

  return null;
}
