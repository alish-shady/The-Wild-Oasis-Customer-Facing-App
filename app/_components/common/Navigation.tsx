"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
  const { data: session } = useSession();
  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link href="/cabins" className="hover:text-accent-400 transition-colors">
            Cabins
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-accent-400 transition-colors">
            About
          </Link>
        </li>
        <li>
          {session?.user?.image ? (
            <Link href="/account" className="hover:text-accent-400 transition-colors flex  gap-4 items-center">
              <Image
                src={session.user.image}
                height={20}
                width={20}
                className="rounded-full"
                alt="User's avatar"
                referrerPolicy="no-referrer"
              />
              <span>Guest area</span>
            </Link>
          ) : (
            <Link href="/account" className="hover:text-accent-400 transition-colors">
              Guest area
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
