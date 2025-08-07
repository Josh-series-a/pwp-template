-- Create storage bucket for package covers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'package-covers', 
  'package-covers', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create RLS policies for package covers bucket
CREATE POLICY "Anyone can view package cover images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'package-covers');

CREATE POLICY "Authenticated users can upload package covers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'package-covers' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own package covers" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'package-covers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own package covers" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'package-covers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);