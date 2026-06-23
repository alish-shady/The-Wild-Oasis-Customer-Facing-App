import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";
import { notFound } from "next/navigation";
import { Cabin } from "../_components/cabins/cabin";
import { Booking } from "../_components/account/booking";
import { Country, CountryApiItem } from "../_components/account/country";
/////////////
// GET

export async function getCabin(id: number): Promise<Cabin> {
  const { data, error } = await supabase.from("cabins").select("*").eq("id", id).single();

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getCabinPrice(id: number) {
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

// Guests are uniquely identified by their email address
export async function getGuest(email: string) {
  const { data, error } = await supabase.from("guests").select("*").eq("email", email).single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id: number): Promise<Booking> {
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
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
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

export async function getSettings() {
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
      "https://api.restcountries.com/countries/v5?response_fields=names.common,flag.emoji&limit=100",
      {
        headers: {
          Authorization: `Bearer ${process.env.RESTCOUNTRIES_KEY}`,
        },
      },
    );
    const { data } = await res.json();
    const countries = data.objects.map((country: CountryApiItem) => {
      return { name: country.names.common, flag: country.flag.emoji };
    });
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest: object) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function createBooking(newBooking: Booking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id: number, updatedFields: object) {
  const { data, error } = await supabase.from("guests").update(updatedFields).eq("id", id).select().single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id: number, updatedFields: Partial<Booking>) {
  const { data, error } = await supabase.from("bookings").update(updatedFields).eq("id", id).select().single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id: number) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
