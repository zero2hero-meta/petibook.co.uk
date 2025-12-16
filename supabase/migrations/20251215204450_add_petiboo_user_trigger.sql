/*
  # Sync auth users to petiboo_users

  Ensures every Supabase auth user automatically gets a row in
  public.petiboo_users when they sign up via Google OAuth.
*/

CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.petiboo_users (
    id,
    email,
    name,
    google_id,
    avatar_url,
    last_login_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'name',
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'user_name',
      NEW.email
    ),
    COALESCE(
      NEW.raw_user_meta_data ->> 'sub',
      NEW.raw_user_meta_data ->> 'user_id'
    ),
    NEW.raw_user_meta_data ->> 'avatar_url',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    google_id = EXCLUDED.google_id,
    avatar_url = EXCLUDED.avatar_url,
    last_login_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_auth_user_created();
