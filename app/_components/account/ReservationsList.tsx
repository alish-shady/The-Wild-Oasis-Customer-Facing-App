"use client";

import { Booking, BookingId } from "@/types/booking";
import ReservationCard from "./ReservationCard";
import { useOptimistic } from "react";
import { deleteReservation } from "@/app/_lib/actions";

export default function ReservationsList({ bookings }: { bookings: Booking[] }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(bookings, (curBookings, bookingId) => {
    return curBookings.filter((booking) => booking.id !== bookingId);
  });
  async function handleDelete(bookingId: BookingId) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }
  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard booking={booking} onDelete={handleDelete} key={booking.id} />
      ))}
    </ul>
  );
}
