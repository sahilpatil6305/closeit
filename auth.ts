import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/password";
import { loginSchema } from "@/schemas/login";
import { env } from "@/lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(
    prisma as unknown as Parameters<typeof PrismaAdapter>[0]
  ) as Adapter,
  session: {
    // CredentialsProvider requires JWT strategy.
    // The "database" strategy is only supported with OAuth providers because
    // Auth.js needs an Account row (created via OAuth) to link a Session row.
    // CredentialsProvider never creates an Account row, so the adapter cannot
    // persist sessions — Auth.js throws UnsupportedStrategy at runtime.
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const normalizedEmail = parsed.data.email.trim().toLowerCase();
        const { password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await comparePassword(
          password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    // Spread the Edge-compatible `authorized` callback from auth.config.ts
    // so the middleware continues to protect routes without importing Prisma.
    ...authConfig.callbacks,

    // jwt() runs whenever a token is created or refreshed.
    // On first sign-in `user` is populated by authorize(); on subsequent
    // requests only `token` is available.  We persist the user's id into
    // the token on that first call so it survives across refreshes.
    async jwt({ token, user }): Promise<JWT> {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },

    // session() receives the decoded JWT token (not a DB user row) when
    // strategy is "jwt".  We surface token.id as session.user.id so every
    // server component and API route can read it via `auth()`.
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
