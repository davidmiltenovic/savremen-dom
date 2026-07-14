/*
  # Fix Leads Updated At Trigger

  1. Changes
    - Drop the old trigger that references updated_at column
    - Ensure the new trigger for last_updated_at is active
    
  2. Notes
    - The column was renamed from updated_at to last_updated_at
    - Old trigger was causing errors when updating leads
*/

-- Drop the old trigger that references the old column name
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;

-- Ensure the new trigger is in place (idempotent)
DROP TRIGGER IF EXISTS trigger_update_leads_last_updated_at ON leads;

CREATE TRIGGER trigger_update_leads_last_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_last_updated_at();
