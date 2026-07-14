/*
  # Add Unique Constraint to Google Reviews
  
  ## Changes
  
  This migration adds a unique constraint on (author_name, time) to prevent duplicate reviews.
  This allows us to use upsert operations when syncing reviews from Google API.
  
  ## Details
  
  - Add unique constraint on combination of `author_name` and `time`
  - This ensures each review from a specific author at a specific time is only stored once
  - Enables accumulation of reviews over multiple API syncs
*/

-- Add unique constraint to prevent duplicate reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'google_reviews_author_time_unique'
  ) THEN
    ALTER TABLE google_reviews 
    ADD CONSTRAINT google_reviews_author_time_unique 
    UNIQUE (author_name, time);
  END IF;
END $$;