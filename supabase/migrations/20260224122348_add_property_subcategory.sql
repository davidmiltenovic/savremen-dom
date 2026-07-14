/*
  # Add subcategory to properties table

  1. Changes
    - Add `subcategory` column to `properties` table to store property type subcategories
    
  2. Subcategory options by property type:
    - Stan (Apartment): garsonjera, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5+
    - Kuća (House): samostalna, u nizu, dvojna/dupleks, 1-etažna, 2-etažna, 3-etažna
    - Poslovni prostor (Commercial): lokal, kancelarija, magacin, hala, ugostiteljski, poslovna zgrada, ostalo
    - Zemljište (Land): plac, građevinsko, poljoprivredno, šumsko
    - Garaža (Garage/Parking): garaža, parking
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'subcategory'
  ) THEN
    ALTER TABLE properties ADD COLUMN subcategory text;
  END IF;
END $$;