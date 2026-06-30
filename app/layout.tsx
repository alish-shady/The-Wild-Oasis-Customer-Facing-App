import "@/app/_styles/globals.css";
import { Albert_Sans } from "next/font/google";
import Header from "@/app/_components/common/Header";
import StoreProvider from "./StoreProvide";
import { SessionProvider } from "next-auth/react";
const albert = Albert_Sans({
  display: "swap",
  subsets: ["latin"],
});
export const metadata = {
  title: {
    template: "The Wild Oasis / %s",
    default: "The Wild Oasis / Welcome",
  },
  description:
    "Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountatins and dark forests.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <body
        className={`bg-primary-950 text-primary-100 antialiased min-h-screen flex flex-col relative ${albert.className}`}
      >
        <SessionProvider>
          <Header />
        </SessionProvider>
        <div className="flex-1 w-full px-8 py-12">
          <main className="w-full mx-auto grow">
            <StoreProvider>{children}</StoreProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
