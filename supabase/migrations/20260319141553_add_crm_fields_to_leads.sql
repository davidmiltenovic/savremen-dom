/*
  # Add CRM Fields to Leads Table

  1. Schema Updates
    - Update status enum to include new pipeline statuses:
      - novi → NEW
      - kontaktiran → CONTACTED
      - zakazan_obilazak → VIEWING_SCHEDULED
      - pregovori → NEGOTIATION (new)
      - zatvoreno → CLOSED
      - izgubljen → LOST (new)
    
    - Add next_action field (text)
    - Add next_action_date field (timestamptz)
    - Rename updated_at to last_updated_at for clarity

  2. Data Migration
    - Keep existing status values compatible during transition

  3. Indexes
    - Add index on last_updated_at for performance on inactive lead queries

  4. Security
    - Maintain existing RLS policies
*/

-- Add new columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'next_action'
  ) THEN
    ALTER TABLE leads ADD COLUMN next_action text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'next_action_date'
  ) THEN
    ALTER TABLE leads ADD COLUMN next_action_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'last_updated_at'
  ) THEN
    -- Rename updated_at to last_updated_at if it exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'leads' AND column_name = 'updated_at'
    ) THEN
      ALTER TABLE leads RENAME COLUMN updated_at TO last_updated_at;
    ELSE
      ALTER TABLE leads ADD COLUMN last_updated_at timestamptz DEFAULT now();
    END IF;
  END IF;
END $$;

-- Drop the old check constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'leads' AND constraint_name = 'leads_status_check'
  ) THEN
    ALTER TABLE leads DROP CONSTRAINT leads_status_check;
  END IF;
END $$;

-- Add new status check constraint with expanded options
ALTER TABLE leads ADD CONSTRAINT leads_status_check 
  CHECK (status IN ('novi', 'kontaktiran', 'zakazan_obilazak', 'ponuda_poslata', 'zatvoreno', 'pregovori', 'izgubljen'));

-- Create index for last_updated_at to optimize inactive lead queries
CREATE INDEX IF NOT EXISTS idx_leads_last_updated_at ON leads(last_updated_at);

-- Create function to auto-update last_updated_at
CREATE OR REPLACE FUNCTION update_leads_last_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update last_updated_at on any change
DROP TRIGGER IF EXISTS trigger_update_leads_last_updated_at ON leads;
CREATE TRIGGER trigger_update_leads_last_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_last_updated_at();
