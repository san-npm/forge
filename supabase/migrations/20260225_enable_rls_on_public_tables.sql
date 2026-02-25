-- ============================================================================
-- Migration: Enable Row Level Security on all public tables
-- Date: 2026-02-25
-- Issue: Supabase Security Advisor lint 0013 (rls_disabled_in_public)
--
-- All 5 tables in the public schema are exposed via PostgREST without RLS,
-- meaning anyone with the anon API key can read and modify all data.
--
-- This migration:
--   1. Enables RLS on each table
--   2. Creates policies restricting access to authenticated users only
--
-- To tighten further with per-user isolation, replace the policies below
-- with column-specific checks (e.g., auth.uid() = owner_id).
-- ============================================================================

-- ======================
-- 1. ENABLE RLS
-- ======================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- ======================
-- 2. RLS POLICIES
-- ======================
-- These policies block anonymous access while allowing any authenticated
-- user full CRUD access. This resolves the Security Advisor lint 0013
-- errors immediately.
--
-- For per-user row isolation, replace auth.role() = 'authenticated'
-- with auth.uid() = <owner_column> once you identify the correct
-- column name in each table.

CREATE POLICY "Authenticated users full access" ON public.companies
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON public.crm_contacts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON public.deals
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON public.activities
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access" ON public.reminders
  FOR ALL USING (auth.role() = 'authenticated');
