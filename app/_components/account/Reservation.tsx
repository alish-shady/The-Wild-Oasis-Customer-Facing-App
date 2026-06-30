import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";
import CabinDateSelector from "../cabins/CabinDateSelector";
import ReservationForm from "./ReservationForm";
import { Cabin } from "../../../types/cabin";
import { auth } from "@/app/_lib/auth";
import LoginMessage from "./LoginMessage";

export default async function Reservation({ cabin }: { cabin: Cabin }) {
  const [settings, bookedDates] = await Promise.all([getSettings(), getBookedDatesByCabinId(cabin.id)]);
  const session = await auth();
  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-100">
      <CabinDateSelector bookedDates={bookedDates} settings={settings} cabin={cabin} />
      {session?.user ? <ReservationForm cabin={cabin} user={session.user} /> : <LoginMessage />}
    </div>
  );
}
