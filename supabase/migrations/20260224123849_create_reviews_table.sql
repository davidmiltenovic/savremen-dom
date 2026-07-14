/*
  # Create Google Reviews Table

  ## Overview
  This migration creates a table to store Google Places reviews for caching purposes.
  Reviews are fetched from Google Places API and stored locally to minimize API calls
  and improve performance.

  ## New Tables
  
  ### `google_reviews`
  Stores individual reviews from Google Places.
  
  - `id` (uuid, primary key) - Unique identifier for each review
  - `author_name` (text) - Name of the reviewer
  - `author_photo_url` (text, nullable) - Profile photo URL of the reviewer
  - `rating` (integer) - Rating given (1-5 stars)
  - `text` (text) - Review text content
  - `time` (bigint) - Unix timestamp of when review was posted
  - `relative_time_description` (text) - Human-readable time description (e.g., "2 months ago")
  - `language` (text, nullable) - Language code of the review
  - `created_at` (timestamptz) - When this record was created in our database
  - `updated_at` (timestamptz) - When this record was last updated

  ## Security
  
  - Enable Row Level Security (RLS) on the table
  - Allow public read access (anyone can view reviews)
  - Only authenticated users can insert/update reviews (via edge function)

  ## Indexes
  
  - Index on `rating` for filtering by rating
  - Index on `time` for sorting by date
  - Index on `created_at` for cache management
*/

-- Create google_reviews table
CREATE TABLE IF NOT EXISTS google_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_photo_url text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL,
  time bigint NOT NULL,
  relative_time_description text NOT NULL,
  language text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reviews (public access)
CREATE POLICY "Anyone can view reviews"
  ON google_reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can insert reviews (edge function will use service role)
CREATE POLICY "Authenticated users can insert reviews"
  ON google_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update reviews
CREATE POLICY "Authenticated users can update reviews"
  ON google_reviews
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete reviews
CREATE POLICY "Authenticated users can delete reviews"
  ON google_reviews
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_google_reviews_rating ON google_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_google_reviews_time ON google_reviews(time DESC);
CREATE INDEX IF NOT EXISTS idx_google_reviews_created_at ON google_reviews(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_google_reviews_updated_at'
  ) THEN
    CREATE TRIGGER update_google_reviews_updated_at
      BEFORE UPDATE ON google_reviews
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;