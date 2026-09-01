CREATE POLICY "Public can read release files"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'duospace-releases');

CREATE POLICY "Admins can upload release files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'duospace-releases' AND public.is_admin());

CREATE POLICY "Admins can update release files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'duospace-releases' AND public.is_admin())
  WITH CHECK (bucket_id = 'duospace-releases' AND public.is_admin());

CREATE POLICY "Admins can delete release files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'duospace-releases' AND public.is_admin());