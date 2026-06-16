import SideNavigation from "@/app/_components/account/SideNavigation";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-12 grow">
      <SideNavigation />
      <div className="py-1">{children}</div>
    </div>
  );
}
