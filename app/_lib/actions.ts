"use server";
import { getGuestId, signIn, signOut } from "@/app/_lib/auth";
import {
  createBooking,
  deleteBooking,
  getBookedDatesByCabinId,
  getBooking,
  updateBooking,
  updateGuest,
} from "./data-service";
import { revalidatePath } from "next/cache";
import { Booking, BookingId } from "@/types/booking";
import { isPast, isWithinInterval } from "date-fns";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfile(formData: FormData) {
  const guestId = await getGuestId();
  const nationalId = formData.get("nationalId");
  if (typeof nationalId !== "string" || !/^[a-zA-Z0-9]{6,12}$/.test(nationalId)) {
    throw new Error("National ID must be 6-12 alphanumeric characters.");
  }
  const [nationality = null, countryFlag = null] = (formData.get("nationality") as string).split("%");
  const updateData = { nationality, countryFlag, nationalId };
  await updateGuest(guestId, updateData);
  revalidatePath("/account/profile");
}

export async function createReservation(
  bookingData: Partial<Booking>,
  prevState: { error: string },
  formData: FormData,
) {
  const guestId = await getGuestId();
  const { cabinId, startDate, endDate } = bookingData;
  if (!startDate || !endDate) return { error: "Start date and the end date are required", success: false };
  if (!cabinId) return { error: "No cabin is selected", success: false };
  const bookedDates = await getBookedDatesByCabinId(cabinId);
  const isAlreadyBooked = bookedDates.some((bookedDate) =>
    isWithinInterval(bookedDate, {
      start: startDate,
      end: endDate,
    }),
  );
  if (isAlreadyBooked) return { error: "The cabin is already reserved for the selected time period", success: false };
  const newBooking = {
    ...bookingData,
    guestId: Number(guestId),
    numGuests: Number(formData.get("numGuests")),
    observations: String(formData.get("observations"))?.slice(0, 1000),
    extrasPrice: 0,
    isPaid: false,
    cabinPrice: bookingData.totalPrice,
    hasBreakfast: false,
    status: "unconfirmed",
  };
  try {
    const data = await createBooking(newBooking);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Something went wrong",
    };
  }
  revalidatePath(`/cabins/${cabinId}`);
  redirect("/cabins/thankyou");
}

export async function deleteReservation(bookingId: BookingId) {
  const guestId = await getGuestId();
  const booking = await getBooking(bookingId);
  if (isPast(booking.startDate)) throw new Error("The booking cannot be deleted.");
  const data = await deleteBooking(bookingId, Number(guestId));
  revalidatePath("/account/reservations");
}

export async function updateReservation(formData: FormData) {
  const guestId = await getGuestId();
  const bookingId = Number(formData.get("bookingId"));
  const observations = String(formData.get("observations")?.slice(0, 1000));
  const numGuests = Number(formData.get("numGuests"));
  const selectedReservation = await getBooking(bookingId || -1);
  if (!selectedReservation) throw new Error("Reservation not found.");
  if (isPast(selectedReservation.startDate)) throw new Error("The booking cannot be updated.");
  const data = await updateBooking(bookingId, Number(guestId), { observations, numGuests });
  revalidatePath("/account/reservations");
  redirect("/account/reservations");
}
