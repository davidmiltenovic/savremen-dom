/*
  # Storage Bucket Setup for Property Images

  ## Changes Made

  ### 1. Create Storage Bucket
  - Create `property-images` bucket for storing property photos
  - Configure bucket to be publicly accessible for image viewing
  - Set file size limits and allowed mime types

  ### 2. Storage Policies
  - Public can view images (SELECT)
  - Only authenticated users can upload images (INSERT)
  - Only authenticated users can update images (UPDATE)
  - Only authenticated users can delete images (DELETE)

  ### 3. Storage Configuration
  - Allow public access for image retrieval
  - Restrict upload to authenticated users only
  - Configure allowed file types: JPEG, PNG, WebP, AVIF
*/

-- =====================================================
-- 1. CREATE STORAGE BUCKET
-- =====================================================

-- Create property-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- =====================================================
-- 2. STORAGE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete property images" ON storage.objects;

-- Allow public viewing of images in property-images bucket
CREATE POLICY "Public can view property images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'property-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images' AND
    (select auth.uid()) IS NOT NULL
  );

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update property images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-images' AND
    (select auth.uid()) IS NOT NULL
  )
  WITH CHECK (
    bucket_id = 'property-images' AND
    (select auth.uid()) IS NOT NULL
  );

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images' AND
    (select auth.uid()) IS NOT NULL
  );