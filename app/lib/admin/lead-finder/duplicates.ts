import type { SupabaseClient } from "@supabase/supabase-js";

export async function findExistingLeadDuplicate(
  supabase: SupabaseClient,
  fields: {
    contact_email?: string | null;
    contact_phone?: string | null;
    source_url?: string | null;
  },
): Promise<string | null> {
  const url = fields.source_url?.split("#")[0].replace(/\/$/, "");

  if (url) {
    const { data } = await supabase
      .from("leads")
      .select("id")
      .eq("listing_url", url)
      .maybeSingle();
    if (data?.id) return data.id;
  }

  if (fields.contact_email) {
    const { data } = await supabase
      .from("leads")
      .select("id")
      .ilike("contact_email", fields.contact_email)
      .maybeSingle();
    if (data?.id) return data.id;
  }

  if (fields.contact_phone) {
    const { data } = await supabase
      .from("leads")
      .select("id")
      .eq("contact_phone", fields.contact_phone)
      .maybeSingle();
    if (data?.id) return data.id;
  }

  return null;
}
