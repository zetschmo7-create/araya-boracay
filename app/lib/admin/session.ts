import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "araya_admin_session";
const SESSION_TTL_SEC = 60 * 60 * 24 * 7;

export function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set and at least 32 characters long.",
    );
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(new Uint8Array(signature));
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createSessionToken(email: string): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SEC;
  const payload = `${email}|${expires}`;
  const payloadB64 = toBase64Url(new TextEncoder().encode(payload));
  const sig = await signPayload(payload, getSessionSecret());
  return `${payloadB64}.${sig}`;
}

export async function verifySessionToken(
  token: string,
): Promise<{ email: string } | null> {
  const dot = token.indexOf(".");
  if (dot === -1) return null;

  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payloadB64 || !sig) return null;

  let payload: string;
  try {
    payload = new TextDecoder().decode(fromBase64Url(payloadB64));
  } catch {
    return null;
  }

  const expectedSig = await signPayload(payload, getSessionSecret());
  if (!timingSafeEqualStrings(sig, expectedSig)) return null;

  const pipe = payload.indexOf("|");
  if (pipe === -1) return null;

  const email = payload.slice(0, pipe);
  const expires = parseInt(payload.slice(pipe + 1), 10);
  if (!email || Number.isNaN(expires)) return null;
  if (expires < Math.floor(Date.now() / 1000)) return null;

  return { email };
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SEC,
  };
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
