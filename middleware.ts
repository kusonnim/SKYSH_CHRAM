import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const url = request.nextUrl.clone();
  const isAuthPage = url.pathname === "/login" || url.pathname === "/signup";
  const isProtectedPage =
    url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/stage");

  if (isProtectedPage && !user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthPage && user) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/stage/:path*", "/login", "/signup"],
};

