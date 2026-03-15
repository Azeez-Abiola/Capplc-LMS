-- Add super_admin role to the profiles table CHECK constraint
-- Run this in the Supabase SQL Editor

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('painter', 'admin', 'super_admin'));
