import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DashboardStats,
  Lead,
  LeadActivity,
  LeadFilter,
  LeadInsert,
} from "./types";

function parseLead(row: Record<string, unknown>): Lead {
  return {
    ...row,
    ai_strengths: Array.isArray(row.ai_strengths) ? row.ai_strengths : [],
    ai_weaknesses: Array.isArray(row.ai_weaknesses) ? row.ai_weaknesses : [],
  } as Lead;
}

export async function getDashboardStats(
  supabase: SupabaseClient,
): Promise<DashboardStats> {
  const now = new Date().toISOString();

  const [all, newLeads, highPriority, followUps, contacted, replied, won, lost] =
    await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("priority", "high")
        .not("status", "in", '("won","lost","not_suitable")'),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .lte("next_follow_up_at", now)
        .not("status", "in", '("won","lost","not_suitable")'),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "contacted"),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "replied"),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "won"),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "lost"),
    ]);

  return {
    total: all.count ?? 0,
    new: newLeads.count ?? 0,
    high_priority: highPriority.count ?? 0,
    follow_ups_due: followUps.count ?? 0,
    contacted: contacted.count ?? 0,
    replied: replied.count ?? 0,
    won: won.count ?? 0,
    lost: lost.count ?? 0,
  };
}

export async function getLeads(
  supabase: SupabaseClient,
  filter: LeadFilter = "all",
): Promise<Lead[]> {
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const now = new Date().toISOString();

  if (filter === "follow_up_due") {
    query = query
      .lte("next_follow_up_at", now)
      .not("status", "in", '("won","lost","not_suitable")');
  } else if (filter === "high_priority") {
    query = query
      .eq("priority", "high")
      .not("status", "in", '("won","lost","not_suitable")');
  } else if (filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(parseLead);
}

export async function getLead(
  supabase: SupabaseClient,
  id: string,
): Promise<Lead | null> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? parseLead(data) : null;
}

export async function getLeadActivities(
  supabase: SupabaseClient,
  leadId: string,
): Promise<LeadActivity[]> {
  const { data, error } = await supabase
    .from("lead_activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as LeadActivity[];
}

export async function createLead(
  supabase: SupabaseClient,
  lead: LeadInsert,
  userId?: string,
): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .insert(lead)
    .select("*")
    .single();

  if (error) throw error;

  await supabase.from("lead_activities").insert({
    lead_id: data.id,
    activity_type: "created",
    description: "Lead created",
    created_by: userId ?? null,
  });

  return parseLead(data);
}

export async function updateLead(
  supabase: SupabaseClient,
  id: string,
  updates: Record<string, unknown>,
  userId?: string,
  activityDescription?: string,
): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;

  if (activityDescription) {
    await supabase.from("lead_activities").insert({
      lead_id: id,
      activity_type: "updated",
      description: activityDescription,
      created_by: userId ?? null,
      metadata: { fields: Object.keys(updates) },
    });
  }

  return parseLead(data);
}

export async function logActivity(
  supabase: SupabaseClient,
  leadId: string,
  activityType: string,
  description: string,
  userId?: string,
  metadata?: Record<string, unknown>,
) {
  await supabase.from("lead_activities").insert({
    lead_id: leadId,
    activity_type: activityType,
    description,
    created_by: userId ?? null,
    metadata: metadata ?? {},
  });
}
