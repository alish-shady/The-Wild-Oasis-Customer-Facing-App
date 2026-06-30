import { auth } from "@/app/_lib/auth";

export const metadata = {
  title: "Account",
};
export default async function Page() {
  const session = await auth();
  const name = session?.user?.name?.split(" ")[0];
  return <h1>Hello {name}.</h1>;
}
