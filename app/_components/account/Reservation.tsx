import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";
import CabinDateSelector from "../cabins/CabinDateSelector";
import ReservationForm from "./ReservationForm";
import { Cabin } from "../cabins/cabin";

export default async function Reservation({ cabin }: { cabin: Cabin }) {
  const [settings, bookedDates] = await Promise.all([getSettings(), getBookedDatesByCabinId(cabin.id)]);
  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-100">
      <CabinDateSelector bookedDates={bookedDates} settings={settings} cabin={cabin} />
      <ReservationForm cabin={cabin} />
    </div>
  );
}
