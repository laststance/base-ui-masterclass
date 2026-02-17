import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@base-ui-masterclass/database";

/**
 * Auth.js v5 configuration with Prisma adapter.
 * Supports GitHub and Google OAuth providers.
 * Session callback attaches user ID and purchase status.
 *
 * @example
 * // In a Server Component:
 * import { auth } from "@/lib/auth";
 * const session = await auth();
 * if (session?.user?.id) { ... }
 *
 * @example
 * // In a Route Handler:
 * import { handlers } from "@/lib/auth";
 * export const { GET, POST } = handlers;
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub, Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;

      // Attach purchase status to session
      const purchase = await prisma.purchase.findUnique({
        where: { userId: user.id },
        select: { status: true },
      });
      (session as SessionWithPurchase).hasPurchased =
        purchase?.status === "active";

      return session;
    },
  },
});

interface SessionWithPurchase {
  hasPurchased: boolean;
}

declare module "next-auth" {
  interface Session {
    hasPurchased?: boolean;
  }
}
