-- Master Schema Patch to resolve 500 errors on the platform
-- Please run this ENTIRE script in your Supabase SQL Editor

-- 1. Add missing tier_access column to courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS tier_access TEXT DEFAULT 'free';

-- 2. Ensure subscription_tiers relationship is recognized by Supabase Cache
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS tier_id UUID;
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_tier_id_fkey;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_tier_id_fkey FOREIGN KEY (tier_id) REFERENCES public.subscription_tiers(id);

-- 3. Reload the Supabase PostgREST schema cache to apply changes immediately
NOTIFY pgrst, 'reload schema';
