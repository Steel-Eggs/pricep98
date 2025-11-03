
-- Create storage bucket for trailer images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'trailer-images',
  'trailer-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Create RLS policies for trailer-images bucket
CREATE POLICY "Public can view trailer images"
ON storage.objects FOR SELECT
USING (bucket_id = 'trailer-images');

CREATE POLICY "Authenticated users can upload trailer images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'trailer-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update trailer images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'trailer-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete trailer images"
ON storage.objects FOR DELETE
USING (bucket_id = 'trailer-images' AND auth.role() = 'authenticated');
