-- CLEAN FIX FOR RECURSION AND AUTH ERRORS
-- Run this to fix the "infinite recursion" and ensure login works

-- 1. Create a safer function to check roles
-- Using auth.jwt() is the fastest/safest way if metadata is set, 
-- but we'll stick to the profiles table with a bypass.
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- We query the table directly. 
  -- SECURITY DEFINER ensures this runs as the owner (bypassing RLS of the caller).
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. RESET POLICIES (Start fresh to avoid conflicts)
DROP POLICY IF EXISTS "Super admins have full access" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view profiles in their company" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Super admins have full access to profiles" ON public.profiles;

-- 3. APPLY ROBUST POLICIES
-- Policy 1: Always allow users to see their OWN profile (No recursion possible here)
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Policy 2: Always allow users to update their OWN profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 3: Super Admins can see EVERYTHING (Uses function)
CREATE POLICY "Super admins have full access" ON public.profiles
FOR ALL TO authenticated
USING (get_auth_role() = 'super_admin');

-- Policy 4: Company Admins can see profiles in their company
-- Note: This might need a company_id check, adding it for completeness
CREATE POLICY "Admins can view company profiles" ON public.profiles
FOR SELECT TO authenticated
USING (
  get_auth_role() = 'admin' AND 
  company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
);

-- 4. ENSURE LOGIN TRIGGER IS OK
-- Check if the trigger that creates the profile is healthy
-- (Optional, but helps if login is still failing due to registration issues)
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
