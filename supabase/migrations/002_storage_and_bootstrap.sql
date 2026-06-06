-- Optional: run after 001_admin_leads.sql

-- Screenshot storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-screenshots', 'lead-screenshots', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins upload lead screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'lead-screenshots' AND is_admin());

CREATE POLICY "Admins read lead screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lead-screenshots' AND is_admin());

-- Bootstrap first admin (replace UUID and email after creating user in Supabase Auth):
-- INSERT INTO admin_profiles (id, email, full_name)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'admin@araya.com', 'ARAYA Admin');
