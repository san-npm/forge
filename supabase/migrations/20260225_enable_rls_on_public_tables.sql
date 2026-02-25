-- ============================================================================
-- Migration: Enable Row Level Security on all public tables
-- Date: 2025-02-25
-- Issue: Supabase Security Advisor lint 0013 (rls_disabled_in_public)
--
-- All 5 tables in the public schema are exposed via PostgREST without RLS,
-- meaning anyone with the anon API key can read and modify all data.
--
-- This migration:
--   1. Enables RLS on each table
--   2. Creates policies so only authenticated users can access their own data
--
-- IMPORTANT: Review and adjust the policies below to match your actual
-- access patterns before running in production.
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
-- These policies assume each table has a `user_id` column (uuid) that
-- references auth.users(id), representing the owner of the row.
--
-- If your tables use a different column name (e.g., `owner_id`, `created_by`),
-- replace `user_id` with the correct column name below.
--
-- If access is team-based rather than user-based, you'll need to adjust
-- the policies to join against a team membership table instead.

-- ---- companies ----

CREATE POLICY "Users can view their own companies"
  ON public.companies FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own companies"
  ON public.companies FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own companies"
  ON public.companies FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own companies"
  ON public.companies FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ---- crm_contacts ----

CREATE POLICY "Users can view their own contacts"
  ON public.crm_contacts FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own contacts"
  ON public.crm_contacts FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own contacts"
  ON public.crm_contacts FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own contacts"
  ON public.crm_contacts FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ---- deals ----

CREATE POLICY "Users can view their own deals"
  ON public.deals FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own deals"
  ON public.deals FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own deals"
  ON public.deals FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own deals"
  ON public.deals FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ---- activities ----

CREATE POLICY "Users can view their own activities"
  ON public.activities FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own activities"
  ON public.activities FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own activities"
  ON public.activities FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own activities"
  ON public.activities FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ---- reminders ----

CREATE POLICY "Users can view their own reminders"
  ON public.reminders FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own reminders"
  ON public.reminders FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own reminders"
  ON public.reminders FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own reminders"
  ON public.reminders FOR DELETE
  USING ((SELECT auth.uid()) = user_id);
