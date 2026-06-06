-- Lead finder discovery workflow columns

CREATE TYPE lead_finder_status AS ENUM (
  'contact_found',
  'research_needed',
  'no_contact_found',
  'imported',
  'duplicate',
  'irrelevant'
);

ALTER TABLE lead_finder_results
  ADD COLUMN IF NOT EXISTS finder_status lead_finder_status,
  ADD COLUMN IF NOT EXISTS next_action TEXT,
  ADD COLUMN IF NOT EXISTS source_type TEXT,
  ADD COLUMN IF NOT EXISTS has_contact BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS lead_finder_results_status_idx ON lead_finder_results(finder_status);
