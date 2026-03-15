-- FIX PROFILES SCHEMA & RLS
-- Run this in your Supabase SQL Editor

-- 1. Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS years_of_experience TEXT,
ADD COLUMN IF NOT EXISTS specialty TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS interests TEXT[], -- Array of strings for interests
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public profiles are viewable by authenticated users (basic info)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles 
FOR SELECT TO authenticated 
USING (true);

-- 4. Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. Policy: Super admins have full access (already covered but reinforcing)
DROP POLICY IF EXISTS "Super admins have full access to profiles" ON public.profiles;
CREATE POLICY "Super admins have full access to profiles" ON public.profiles 
FOR ALL TO authenticated 
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);
