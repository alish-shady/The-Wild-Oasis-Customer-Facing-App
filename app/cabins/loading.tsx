import Spinner from "@/app/_components/common/Spinner";
export default function Loading() {
  return (
    <div className="grid items-center justify-center">
      <Spinner />
      <h1 className="text-xl text-primary-200">Cabin data is loading...</h1>
    </div>
  );
}
