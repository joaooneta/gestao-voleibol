import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { getCurrentUser } from "./lib/auth";

const authRoutes = ["/login", "/register"];
const protectedRoutes = [
  "/teams",
  "/athletes",
  "/teams/:path*",
  "/tournaments",
  "/tournaments/:path*",
  "/explore",
  "/explore/:path*",
];
const tournamentManagerRoutes = ["/tournaments", "/tournaments/:path*"];
const teamManagerRoutes = [
  "/teams",
  "/athletes",
  "/teams/:path*",
  "/explore",
  "/explore/:path*",
];

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const session = await getCurrentUser();
  const userRole = session?.role;

  if (
    !sessionCookie &&
    protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie && authRoutes.includes(pathname)) {
    const url = userRole === "TEAM_MANAGER" ? "/teams" : "/tournaments";
    return NextResponse.redirect(new URL(url, request.url));
  }

  if (session && userRole === "TOURNAMENT_MANAGER") {
    const isManagerRoute = tournamentManagerRoutes.some((route) =>
      pathname.startsWith(route),
    );

    if (!isManagerRoute)
      return NextResponse.redirect(new URL("/tournaments", request.url));
  }

  if (session && userRole === "TEAM_MANAGER") {
    const isManagerRoute = teamManagerRoutes.some((route) =>
      pathname.startsWith(route),
    );

    if (!isManagerRoute)
      return NextResponse.redirect(new URL("/teams", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/teams",
    "/athletes",
    "/teams/:path*",
    "/tournaments",
    "/tournaments/:path*",
    "/explore",
    "/explore/:path*",
  ],
};
