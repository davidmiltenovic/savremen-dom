/*
  # SavremenDom Real Estate Platform - Initial Schema

  1. New Tables
    - profiles: User profiles with roles (super_admin, agent)
    - properties: Real estate listings with all details
    - property_images: Images for properties
    - leads: Customer inquiries and lead management

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
*/

-- Profiles table for admin users and agents
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('super_admin', 'agent')),
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  property_type text NOT NULL CHECK (property_type IN ('stan', 'kuća', 'poslovni_prostor', 'zemljište', 'garaža')),
  transaction_type text NOT NULL CHECK (transaction_type IN ('prodaja', 'izdavanje')),
  price numeric NOT NULL,
  price_per_m2 numeric,
  area numeric NOT NULL,
  rooms integer,
  floor integer,
  total_floors integer,
  year_built integer,
  registered boolean DEFAULT false,
  heating text,
  has_elevator boolean DEFAULT false,
  parking text,
  has_terrace boolean DEFAULT false,
  has_balcony boolean DEFAULT false,
  has_basement boolean DEFAULT false,
  has_yard boolean DEFAULT false,
  furnished text CHECK (furnished IN ('namešteno', 'polunamešteno', 'prazno')),
  status text NOT NULL DEFAULT 'aktivno' CHECK (status IN ('aktivno', 'rezervisano', 'prodato')),
  featured boolean DEFAULT false,
  city text NOT NULL,
  municipality text,
  street text,
  hide_exact_address boolean DEFAULT false,
  latitude numeric,
  longitude numeric,
  description text,
  video_url text,
  tour_3d_url text,
  meta_title text,
  meta_description text,
  slug text UNIQUE NOT NULL,
  views integer DEFAULT 0,
  agent_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url text NOT NULL,
  is_main boolean DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  message text,
  lead_type text NOT NULL CHECK (lead_type IN ('upit', 'obilazak')),
  status text NOT NULL DEFAULT 'novi' CHECK (status IN ('novi', 'kontaktiran', 'zakazan_obilazak', 'ponuda_poslata', 'zatvoreno')),
  assigned_agent_id uuid REFERENCES profiles(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON leads(property_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Authenticated users can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Properties policies - Public can view active properties
CREATE POLICY "Anyone can view active properties"
  ON properties FOR SELECT
  TO anon, authenticated
  USING (status = 'aktivno' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (true);

-- Property images policies - Public can view images of active properties
CREATE POLICY "Anyone can view property images"
  ON property_images FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_images.property_id
      AND (properties.status = 'aktivno' OR auth.uid() IS NOT NULL)
    )
  );

CREATE POLICY "Authenticated users can manage property images"
  ON property_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Leads policies
CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-generate property code
CREATE OR REPLACE FUNCTION generate_property_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := 'SD-' || LPAD(nextval('property_code_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for property codes
CREATE SEQUENCE IF NOT EXISTS property_code_seq START 1000;

-- Trigger for auto-generating property code
CREATE TRIGGER generate_property_code_trigger
  BEFORE INSERT ON properties
  FOR EACH ROW
  EXECUTE FUNCTION generate_property_code();

-- Function to calculate price per m2
CREATE OR REPLACE FUNCTION calculate_price_per_m2()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.area > 0 THEN
    NEW.price_per_m2 := ROUND(NEW.price / NEW.area, 2);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for calculating price per m2
CREATE TRIGGER calculate_price_per_m2_trigger
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION calculate_price_per_m2();