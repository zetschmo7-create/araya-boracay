-- Public web lead finder staging tables

CREATE TYPE lead_finder_entity_type AS ENUM (
  'villa_owner_operator',
  'condo_owner_operator',
  'real_estate_agent',
  'property_manager',
  'hotel_resort',
  'irrelevant'
);

CREATE TABLE lead_finder_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query TEXT NOT NULL,
  provider TEXT,
  result_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_finder_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES lead_finder_runs(id) ON DELETE CASCADE,
  page_title TEXT,
  source_url TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  whatsapp TEXT,
  property_name TEXT,
  source_platform TEXT,
  page_summary TEXT,
  extraction_evidence TEXT,
  entity_type lead_finder_entity_type,
  araya_fit_score INTEGER CHECK (araya_fit_score >= 0 AND araya_fit_score <= 100),
  priority lead_priority,
  fit_rationale TEXT,
  outreach_angle TEXT,
  ai_email_draft TEXT,
  imported BOOLEAN NOT NULL DEFAULT FALSE,
  imported_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  duplicate_of_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX lead_finder_results_run_id_idx ON lead_finder_results(run_id);
CREATE INDEX lead_finder_results_source_url_idx ON lead_finder_results(source_url);
CREATE INDEX lead_finder_results_email_idx ON lead_finder_results(contact_email);
CREATE INDEX lead_finder_results_imported_idx ON lead_finder_results(imported);

ALTER TABLE lead_finder_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_finder_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage lead_finder_runs"
  ON lead_finder_runs FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins manage lead_finder_results"
  ON lead_finder_results FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
