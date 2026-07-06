import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

declare module "@auth/core/types" {
  interface DefaultUser {
    guestId: string;
  }
}

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => Boolean(auth?.user),
    async signIn({ user }) {
      try {
        if (!user.email || !user.name) return false;
        const existingGuest = await getGuest(user.email);
        if (!existingGuest) await createGuest({ fullName: user.name, email: user.email });
        return true;
      } catch {
        return false;
      }
    },
    async session({ session }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = String(guest.id);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

export const getGuestId = async () => {
  const session = await auth();
  if (!session || !session.user) throw new Error("You must be logged in for this action.");
  return session.user.guestId;
};
