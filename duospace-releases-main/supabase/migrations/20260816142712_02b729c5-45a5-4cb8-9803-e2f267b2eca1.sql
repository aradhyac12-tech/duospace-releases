-- ROLES ---------------------------------------------------------------
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

-- First registered account becomes the admin; everyone else is a normal user.
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_admin BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO has_admin;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN has_admin THEN 'user'::public.app_role ELSE 'admin'::public.app_role END)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- RELEASES ------------------------------------------------------------
CREATE TYPE public.release_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE public.app_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  build_number INTEGER,
  release_notes TEXT,
  apk_storage_path TEXT,
  apk_filename TEXT,
  apk_size_bytes BIGINT,
  apk_sha256 TEXT,
  google_play_url TEXT,
  apple_app_store_url TEXT,
  ipa_url TEXT,
  ipa_label TEXT,
  web_url TEXT,
  status public.release_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX one_published_release
  ON public.app_releases ((status)) WHERE status = 'published';

CREATE INDEX app_releases_created_at_idx ON public.app_releases (created_at DESC);

GRANT SELECT ON public.app_releases TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_releases TO authenticated;
GRANT ALL ON public.app_releases TO service_role;

ALTER TABLE public.app_releases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read the published release"
  ON public.app_releases FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can read every release"
  ON public.app_releases FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can create releases"
  ON public.app_releases FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() AND created_by = auth.uid());

CREATE POLICY "Admins can update releases"
  ON public.app_releases FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete releases"
  ON public.app_releases FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER app_releases_set_updated_at
  BEFORE UPDATE ON public.app_releases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Atomic publish: archive the current published release, publish the new one.
CREATE OR REPLACE FUNCTION public.publish_release(_release_id UUID)
RETURNS public.app_releases
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.app_releases;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  UPDATE public.app_releases
     SET status = 'archived'
   WHERE status = 'published' AND id <> _release_id;

  UPDATE public.app_releases
     SET status = 'published', published_at = now()
   WHERE id = _release_id
  RETURNING * INTO result;

  IF result IS NULL THEN
    RAISE EXCEPTION 'release_not_found';
  END IF;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.unpublish_release(_release_id UUID)
RETURNS public.app_releases
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.app_releases;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  UPDATE public.app_releases
     SET status = 'archived'
   WHERE id = _release_id AND status = 'published'
  RETURNING * INTO result;

  IF result IS NULL THEN
    RAISE EXCEPTION 'release_not_found';
  END IF;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.publish_release(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.unpublish_release(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.publish_release(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unpublish_release(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;