-- ============================================================================
-- IMMEDIATE FIX: Enable RLS on all exposed public tables
--
-- Run this FIRST to stop unauthorized access immediately.
-- WARNING: This will block ALL access (including your app) until you add
-- RLS policies. If your app breaks, either:
--   a) Add proper policies (see 20260225_enable_rls_on_public_tables.sql)
--   b) Or temporarily grant access to authenticated users with:
--      CREATE POLICY "Authenticated access" ON public.<table>
--        FOR ALL USING (auth.role() = 'authenticated');
-- ============================================================================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
