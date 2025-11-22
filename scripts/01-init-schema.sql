-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  labelId TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  qr_code_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for products" ON products
  FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to insert/update/delete
CREATE POLICY "Admin can insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete products" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON TABLE products TO authenticated;
GRANT SELECT ON TABLE products TO anon;