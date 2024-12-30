import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth((req) => {
  const session = req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!session.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
