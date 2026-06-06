import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/app/lib/admin/session";
import { getSupabaseUrl } from "./config";

export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Required for admin database access.",
    );
  }

  return createSupabaseClient(getSupabaseUrl(), serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    return { supabase: null, isAdmin: false, adminEmail: null };
  }

  try {
    const supabase = createServiceClient();
    return { supabase, isAdmin: true, adminEmail: session.email };
  } catch {
    return { supabase: null, isAdmin: false, adminEmail: session.email };
  }
}
