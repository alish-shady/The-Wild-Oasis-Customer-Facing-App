import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";
import { notFound } from "next/navigation";
import { Cabin, CabinId } from "../../types/cabin";
import { Booking, BookingId } from "../../types/booking";
import { Country, CountryApiItem } from "../../types/country";
import { Settings } from "../../types/settings";
import { Guest, NewGuest } from "@/types/guest";
/////////////
// GET

export async function getCabin(id: CabinId): Promise<Cabin> {
  const { data, error } = await supabase.from("cabins").select("*").eq("id", id).single();

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getCabinPrice(id: CabinId) {
  const { data, error } = await supabase.from("cabins").select("regularPrice, discount").eq("id", id).single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function (capacity: string): Promise<Cabin[]> {
  const query = supabase.from("cabins").select("id, name, maxCapacity, regularPrice, discount, image").order("name");
  if (capacity === "small") query.lte("maxCapacity", 3);
  if (capacity === "medium") query.gte("maxCapacity", 4).lte("maxCapacity", 7);
  if (capacity === "large") query.gte("maxCapacity", 8);
  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

export async function getGuest(email: string): Promise<Guest> {
  const { data, error } = await supabase.from("guests").select("*").eq("email", email).single();

  return data;
}

export async function getBooking(id: BookingId): Promise<Booking> {
  const { data, error, count } = await supabase.from("bookings").select("*").eq("id", id).single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(guestId: number): Promise<Booking[]> {
  const { data, error, count } = await supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, status, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)",
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId: number) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayISO = today.toISOString();
  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${todayISO},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase.from("settings").select("*").single();
  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries(): Promise<Country[]> {
  try {
    const res = await fetch(
      "https://api.restcountries.com/countries/v5?response_fields=names.common,codes.alpha_2&limit=100",
      {
        headers: {
          Authorization: `Bearer ${process.env.RESTCOUNTRIES_KEY}`,
        },
      },
    );
    const { data } = await res.json();
    const countries = data.objects.map((country: CountryApiItem) => {
      return { name: country.names.common, flag: country.codes.alpha_2 };
    });
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest: NewGuest) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function createBooking(newBooking: Partial<Booking>) {
  const { data, error } = await supabase.from("bookings").insert([newBooking]).select().single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE

export async function updateGuest(id: string, updatedFields: Partial<Guest>) {
  const { data, error } = await supabase.from("guests").update(updatedFields).eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
}

export async function updateBooking(id: BookingId, guestId: number, updatedFields: Partial<Booking>) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .eq("guestId", guestId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id: BookingId, guestId: number) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id).eq("guestId", guestId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
