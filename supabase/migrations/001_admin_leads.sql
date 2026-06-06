-- ARAYA Admin Lead Engine schema
-- Run in Supabase SQL Editor or via Supabase CLI

CREATE TYPE lead_status AS ENUM (
  'new',
  'qualified',
  'drafted',
  'contacted',
  'replied',
  'interested',
  'call_booked',
  'won',
  'lost',
  'not_suitable'
);

CREATE TYPE lead_priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_name TEXT,
  owner_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  source_platform TEXT,
  listing_url TEXT,
  listing_text TEXT,
  property_type TEXT,
  location TEXT,
  bedrooms INTEGER,
  nightly_rate NUMERIC(12, 2),
  rating NUMERIC(3, 2),
  review_count INTEGER,
  property_description TEXT,
  notes TEXT,
  presentation_quality TEXT,
  photography_quality TEXT,
  guest_review_issues TEXT,
  self_managed_likelihood TEXT,
  araya_fit_score INTEGER CHECK (araya_fit_score >= 0 AND araya_fit_score <= 100),
  priority lead_priority NOT NULL DEFAULT 'medium',
  status lead_status NOT NULL DEFAULT 'new',
  last_contacted_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  screenshot_url TEXT,
  ai_summary TEXT,
  ai_fit_rationale TEXT,
  ai_strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_presentation_weaknesses TEXT,
  ai_operational_weaknesses TEXT,
  ai_opportunity TEXT,
  ai_outreach_angle TEXT,
  ai_email_draft TEXT,
  ai_whatsapp_draft TEXT,
  ai_follow_up_1 TEXT,
  ai_follow_up_2 TEXT,
  ai_analysed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX leads_status_idx ON leads(status);
CREATE INDEX leads_priority_idx ON leads(priority);
CREATE INDEX leads_next_follow_up_idx ON leads(next_follow_up_at);
CREATE INDEX leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX lead_activities_lead_id_idx ON lead_activities(lead_id);

CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_profiles WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "Admins read profiles"
  ON admin_profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins manage leads"
  ON leads FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins manage activities"
  ON lead_activities FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Storage bucket for lead screenshots (create in Supabase dashboard or run):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('lead-screenshots', 'lead-screenshots', false);
-- CREATE POLICY "Admins upload screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lead-screenshots' AND is_admin());
-- CREATE POLICY "Admins read screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'lead-screenshots' AND is_admin());
