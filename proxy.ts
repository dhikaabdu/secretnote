import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/auth/constants";
import { getNotesAccessDecision } from "./lib/auth/protection";

export function proxy(request: NextRequest) {
  const decision = getNotesAccessDecision(
    request.nextUrl.pathname,
    request.cookies.has(SESSION_COOKIE_NAME),
  );

  if (decision === "continue") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/notes/:path*"],
};
