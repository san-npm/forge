-- OpenLetz Supabase Migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  company     TEXT,
  rcs         TEXT,
  role        TEXT,
  company_size TEXT,
  sector      TEXT,
  subject     TEXT,
  phone       TEXT,
  message     TEXT,
  preferred_contact TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (required by Supabase)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 4. Policies: allow inserts from the service role (API routes use service key)
--    No public read access — data is only accessible via Supabase Dashboard or service key
CREATE POLICY "Service role can insert contacts"
  ON contacts FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read contacts"
  ON contacts FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert newsletter"
  ON newsletter_subscribers FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read newsletter"
  ON newsletter_subscribers FOR SELECT
  TO service_role
  USING (true);
