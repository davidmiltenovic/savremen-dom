/*
  # Add Dynamic Property Fields System

  ## Summary
  Enables dynamic field management per property type for flexible real estate listings.

  ## Changes Made

  ### 1. New Columns
  - `details` (JSONB) - Stores type-specific fields as structured JSON
  - `urgent_sale` (boolean) - Flag for urgent sale properties

  ### 2. Property Type Updates
  - Updates property_type enum values to English equivalents
  - Maps existing Serbian values to new English format:
    - 'stan' → 'APARTMENT'
    - 'kuća' → 'HOUSE' 
    - 'poslovni_prostor' → 'COMMERCIAL'
    - 'zemljište' → 'LAND'
    - 'garaža' → 'GARAGE'

  ### 3. Field Organization
  Each property type now supports specific fields in the `details` JSONB column:

  **APARTMENT** fields:
  - condition, bathrooms, toilets, view, orientation
  - has_loggia, parking_spaces, internet, cable_tv, phone

  **HOUSE** fields:
  - plot_area, num_floors, building_material, condition
  - has_loggia, bathrooms, toilets, water_supply
  - has_yard_space, garage_spaces, parking_spaces
  - internet, cable_tv, phone

  **LAND** fields:
  - area_in_ares, has_water, has_electricity
  - has_sewage, paved_access, purpose, urban_conditions

  **COMMERCIAL** fields:
  - condition, additional_rooms, has_toilet
  - parking_available, has_elevator, view
  - internet, cable_tv, public_transport_access

  **GARAGE** fields:
  - garage_spaces, garage_type, video_surveillance
  - has_electricity, automatic_doors

  ### 4. Index Creation
  - GIN index on `details` column for fast JSONB queries

  ## Important Notes
  - Existing property data is preserved with type conversion
  - Details column allows flexible, type-specific data storage
  - No data loss during migration
  - RLS policies remain unchanged
*/

-- Add new columns
DO $$
BEGIN
  -- Add details JSONB column for dynamic fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'details'
  ) THEN
    ALTER TABLE properties ADD COLUMN details JSONB DEFAULT '{}'::jsonb;
  END IF;

  -- Add urgent_sale flag
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'urgent_sale'
  ) THEN
    ALTER TABLE properties ADD COLUMN urgent_sale boolean DEFAULT false;
  END IF;
END $$;

-- Drop the old check constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'properties_property_type_check'
  ) THEN
    ALTER TABLE properties DROP CONSTRAINT properties_property_type_check;
  END IF;
END $$;

-- Update existing property types to new format
UPDATE properties SET property_type = 'APARTMENT' WHERE property_type = 'stan';
UPDATE properties SET property_type = 'HOUSE' WHERE property_type = 'kuća';
UPDATE properties SET property_type = 'COMMERCIAL' WHERE property_type = 'poslovni_prostor';
UPDATE properties SET property_type = 'LAND' WHERE property_type = 'zemljište';
UPDATE properties SET property_type = 'GARAGE' WHERE property_type = 'garaža';

-- Add new check constraint with updated values
ALTER TABLE properties ADD CONSTRAINT properties_property_type_check 
  CHECK (property_type IN ('APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND', 'GARAGE'));

-- Create index for faster JSONB queries
CREATE INDEX IF NOT EXISTS idx_properties_details ON properties USING GIN (details);

-- Add comment explaining the details structure
COMMENT ON COLUMN properties.details IS 'Type-specific property fields stored as JSONB. Structure varies by property_type.';