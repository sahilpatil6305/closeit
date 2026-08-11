import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const publicRoutes = ["/", "/login", "/register"];
      const publicPrefixes = [
        "/browse",
        "/listing",
        "/user",
        "/public",
        "/api/listings",
        "/api/user",
      ];
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      const isPublicRoute =
        publicRoutes.includes(nextUrl.pathname) ||
        publicPrefixes.some((prefix) => nextUrl.pathname.startsWith(prefix)) ||
        isApiAuthRoute;

      if (
        isLoggedIn &&
        (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
      ) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (!isPublicRoute) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
