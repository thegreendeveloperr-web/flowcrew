-- FlowCrew Step 1: per-user leads (multi-tenant) with RLS
-- Apply in Supabase SQL Editor or via: supabase db push
--
-- Legacy rows: export first if you need them. Rows without user_id are removed
-- before NOT NULL, because they cannot be safely assigned to a user.

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE;

-- Orphan leads (pre-auth imports) are not exposed under RLS and are removed.
DELETE FROM public.leads
WHERE user_id IS NULL;

ALTER TABLE public.leads
  ALTER COLUMN user_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS leads_user_id_idx ON public.leads (user_id);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS leads_select_own ON public.leads;
DROP POLICY IF EXISTS leads_insert_own ON public.leads;
DROP POLICY IF EXISTS leads_update_own ON public.leads;
DROP POLICY IF EXISTS leads_delete_own ON public.leads;

CREATE POLICY leads_select_own
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (auth.uid () = user_id);

CREATE POLICY leads_insert_own
  ON public.leads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid () = user_id);

CREATE POLICY leads_update_own
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (auth.uid () = user_id)
  WITH CHECK (auth.uid () = user_id);

CREATE POLICY leads_delete_own
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (auth.uid () = user_id);
