"use server";
import { auth, signIn, signOut } from "@/app/_lib/auth";
import { updateGuest } from "./data-service";
import { revalidatePath } from "next/cache";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) throw new Error("You must be logged in for this action.");
  const nationalId = formData.get("nationalId");
  if (typeof nationalId !== "string" || !/^[a-zA-Z0-9]{6,12}$/.test(nationalId)) {
    throw new Error("National ID must be 6-12 alphanumeric characters.");
  }
  const [nationality = null, countryFlag = null] = (formData.get("nationality") as string).split("%");
  const updateData = { nationality, countryFlag, nationalId };
  await updateGuest(session.user.guestId, updateData);
  revalidatePath("/account/profile");
}
