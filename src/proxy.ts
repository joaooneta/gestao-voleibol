import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/teams"];

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (
    !sessionCookie &&
    protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/teams", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/teams", "/athletes", "/teams/:path*"],
};
