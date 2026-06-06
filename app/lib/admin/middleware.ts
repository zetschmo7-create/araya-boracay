import {
  ADMIN_SESSION_COOKIE,
  verifySessionToken,
} from "@/app/lib/admin/session";
import { NextResponse, type NextRequest } from "next/server";

export async function protectAdminRoutes(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      isAuthenticated = (await verifySessionToken(token)) !== null;
    } catch {
      isAuthenticated = false;
    }
  }

  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
