/*
  # Fix Security Issues - Indexes and RLS Policies
  
  ## Overview
  This migration addresses multiple security and performance issues identified by Supabase security scanner.
  
  ## Changes
  
  ### 1. Add Missing Indexes for Foreign Keys
  - Add index on `leads.property_id` for better query performance
  - Add index on `property_images.property_id` for better query performance
  
  ### 2. Remove Unused Indexes
  - Drop `idx_leads_assigned_agent_id` (not used)
  - Drop `idx_properties_agent_id` (not used)
  - Drop `idx_google_reviews_rating` (not used)
  - Drop `idx_google_reviews_created_at` (not used)
  
  ### 3. Fix Function Search Path Security Issue
  - Set search_path for `update_updated_at_column` function to be immutable
  
  ### 4. Fix RLS Policies
  - Remove overly permissive policies on `google_reviews` table
  - Only edge functions (using service role) should modify reviews
  - Keep public read access for reviews
  - Keep leads insert policy as-is (it's intentionally open for contact forms)
  
  ## Security Notes
  - Foreign key indexes improve join performance and prevent table scans
  - Removing unused indexes reduces write overhead
  - Function search path must be set to prevent privilege escalation
  - RLS policies should be as restrictive as possible
*/

-- ============================================================================
-- 1. ADD MISSING INDEXES FOR FOREIGN KEYS
-- ============================================================================

-- Add index for leads.property_id foreign key
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON leads(property_id);

-- Add index for property_images.property_id foreign key
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);

-- ============================================================================
-- 2. REMOVE UNUSED INDEXES
-- ============================================================================

-- Drop unused index on leads.assigned_agent_id
DROP INDEX IF EXISTS idx_leads_assigned_agent_id;

-- Drop unused index on properties.agent_id
DROP INDEX IF EXISTS idx_properties_agent_id;

-- Drop unused index on google_reviews.rating
DROP INDEX IF EXISTS idx_google_reviews_rating;

-- Drop unused index on google_reviews.created_at
DROP INDEX IF EXISTS idx_google_reviews_created_at;

-- ============================================================================
-- 3. FIX FUNCTION SEARCH PATH SECURITY ISSUE
-- ============================================================================

-- Recreate the function with proper search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public;

-- ============================================================================
-- 4. FIX RLS POLICIES ON GOOGLE_REVIEWS
-- ============================================================================

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON google_reviews;
DROP POLICY IF EXISTS "Authenticated users can update reviews" ON google_reviews;
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON google_reviews;

-- Note: We keep "Anyone can view reviews" policy as-is for public access
-- The edge function will use service role to insert/update/delete reviews
-- No additional policies needed since service role bypasses RLS
