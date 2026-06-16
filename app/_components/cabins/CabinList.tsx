import CabinCard from "@/app/_components/cabins/CabinCard";
import { Cabin } from "@/app/_components/cabins/cabin";
import { getCabins } from "@/app/_lib/data-service";
export default async function CabinList() {
  const cabins: Cabin[] = await getCabins();
  if (!cabins.length) return null;
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {cabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
