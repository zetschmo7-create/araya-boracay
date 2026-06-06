import {
  ADMIN_SESSION_COOKIE,
  getSessionCookieOptions,
} from "@/app/lib/admin/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(new URL("/admin/login", origin));
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
