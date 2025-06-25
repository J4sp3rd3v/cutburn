-- Abilita RLS sulla tabella dei profili se non è già abilitata
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Rimuovi le policy esistenti per evitare conflitti
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile." ON public.user_profiles;

-- Policy: Consenti agli utenti di leggere il proprio profilo
CREATE POLICY "Users can read their own profile."
ON public.user_profiles FOR SELECT
USING (auth.uid() = auth_user_id);

-- Policy: Consenti agli utenti di inserire il proprio profilo
CREATE POLICY "Users can insert their own profile."
ON public.user_profiles FOR INSERT
WITH CHECK (auth.uid() = auth_user_id);

-- Policy: Consenti agli utenti di aggiornare il proprio profilo
CREATE POLICY "Users can update their own profile."
ON public.user_profiles FOR UPDATE
USING (auth.uid() = auth_user_id)
WITH CHECK (auth.uid() = auth_user_id);

-- Policy: Consenti agli utenti di eliminare il proprio profilo
CREATE POLICY "Users can delete their own profile."
ON public.user_profiles FOR DELETE
USING (auth.uid() = auth_user_id); 