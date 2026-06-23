"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CapacityFilter = "all" | "small" | "medium" | "large";

type FilterButtonProps = {
  children: string;
  filter: CapacityFilter;
  handleFilter: (filter: CapacityFilter) => void;
  activeFilter: CapacityFilter;
};

export default function CabinFilterPanel() {
  const currentSearchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const raw = currentSearchParams.get("capacity");
  const activeFilter: CapacityFilter =
    raw === "small" || raw === "medium" || raw === "large" || raw === "all" ? raw : "all";
  function handleFilter(filter: CapacityFilter) {
    const searchParams = new URLSearchParams(currentSearchParams);
    searchParams.set("capacity", filter);
    router.replace(`${pathname}?${searchParams.toString()}`);
  }
  return (
    <div className="border border-primary-800 flex">
      <Button handleFilter={handleFilter} activeFilter={activeFilter} filter="all">
        All cabins
      </Button>
      <Button handleFilter={handleFilter} activeFilter={activeFilter} filter="small">
        1&mdash;3 guests
      </Button>
      <Button handleFilter={handleFilter} activeFilter={activeFilter} filter="medium">
        4&mdash;7 guests
      </Button>
      <Button handleFilter={handleFilter} activeFilter={activeFilter} filter="large">
        8&mdash;12 guests
      </Button>
    </div>
  );
}

function Button({ children, handleFilter, activeFilter, filter }: FilterButtonProps) {
  return (
    <button
      className={`px-2 py-5 hover:bg-primary-700 ${activeFilter === filter ? "bg-primary-900 text-primary-50" : ""}`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}
