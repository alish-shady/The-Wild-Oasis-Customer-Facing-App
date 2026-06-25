import Reservation from "@/app/_components/account/Reservation";
import CabinComponent from "@/app/_components/cabins/CabinComponent";
import Spinner from "@/app/_components/common/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";
export async function generateMetadata(props: PageProps<"/cabins/[cabinId]">) {
  const { cabinId } = await props.params;
  const { name } = await getCabin(Number(cabinId));
  return { title: `${name} cabin` };
}
export async function generateStaticParams() {
  const cabins = await getCabins("all");
  const ids = cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));
  return ids;
}
export const dynamicParams = false;
export default async function Page(props: PageProps<"/cabins/[cabinId]">) {
  const cabinId = Number((await props.params).cabinId);
  const cabin = await getCabin(Number(cabinId));
  const { name } = cabin;
  return (
    <div className="max-w-6xl mx-auto mt-8">
      <CabinComponent cabin={cabin} />
      <div>
        <h2 className="text-5xl font-semibold text-center mb-8 text-accent-400">
          Reserve {name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
