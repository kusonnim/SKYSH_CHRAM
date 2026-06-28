import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
  // TODO(Developer A): redirect unauthenticated users away from protected routes.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/stage/:path*", "/login", "/signup"],
};

