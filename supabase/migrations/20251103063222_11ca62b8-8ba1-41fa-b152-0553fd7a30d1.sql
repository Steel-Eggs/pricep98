-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table (trailers)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  base_image_url TEXT,
  base_price NUMERIC(10, 2) NOT NULL,
  old_price NUMERIC(10, 2),
  discount_label TEXT,
  availability TEXT NOT NULL DEFAULT 'В наличии',
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  wheel_options JSONB DEFAULT '{}'::jsonb,
  hub_options JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create specifications table
CREATE TABLE public.specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  spec_name TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tents table
CREATE TABLE public.tents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  default_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product_tents junction table
CREATE TABLE public.product_tents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  tent_id UUID REFERENCES public.tents(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  price NUMERIC(10, 2) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, tent_id)
);

-- Create accessories table
CREATE TABLE public.accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  default_price NUMERIC(10, 2) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product_accessories junction table
CREATE TABLE public.product_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  accessory_id UUID REFERENCES public.accessories(id) ON DELETE CASCADE NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, accessory_id)
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_accessories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public can view specifications" ON public.specifications FOR SELECT USING (true);
CREATE POLICY "Public can view tents" ON public.tents FOR SELECT USING (true);
CREATE POLICY "Public can view product_tents" ON public.product_tents FOR SELECT USING (true);
CREATE POLICY "Public can view accessories" ON public.accessories FOR SELECT USING (true);
CREATE POLICY "Public can view product_accessories" ON public.product_accessories FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_specifications_product_id ON public.specifications(product_id);
CREATE INDEX idx_product_tents_product_id ON public.product_tents(product_id);
CREATE INDEX idx_product_tents_tent_id ON public.product_tents(tent_id);
CREATE INDEX idx_product_accessories_product_id ON public.product_accessories(product_id);
CREATE INDEX idx_product_accessories_accessory_id ON public.product_accessories(accessory_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for products table
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();