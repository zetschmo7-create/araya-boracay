import { protectAdminRoutes } from "@/app/lib/admin/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return protectAdminRoutes(request);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
