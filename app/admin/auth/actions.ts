"use server";

import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  getSessionCookieOptions,
  safeEqual,
} from "@/app/lib/admin/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AuthActionState = {
  error?: string;
  success?: string;
};

function safeRedirectPath(path: string | null | undefined): string {
  if (!path || !path.startsWith("/admin") || path.startsWith("//")) {
    return "/admin";
  }
  return path;
}

export async function signInAction(
  _prev: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeRedirectPath(
    String(formData.get("redirectTo") ?? "/admin"),
  );

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return {
      error:
        "Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD.",
    };
  }

  if (
    email.toLowerCase() !== adminEmail.toLowerCase() ||
    !safeEqual(password, adminPassword)
  ) {
    return { error: "Invalid email or password." };
  }

  try {
    const token = await createSessionToken(adminEmail);
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to create admin session.",
    };
  }

  redirect(redirectTo);
}
