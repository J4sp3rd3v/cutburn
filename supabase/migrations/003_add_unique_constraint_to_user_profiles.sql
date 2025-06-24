-- Add a UNIQUE constraint to the auth_user_id column in the user_profiles table.
-- This is necessary to allow upsert operations using ON CONFLICT.

ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_auth_user_id_key UNIQUE (auth_user_id); 