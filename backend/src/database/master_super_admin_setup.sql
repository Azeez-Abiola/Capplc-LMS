-- MASTER SQL FOR SUPER ADMIN & B2B INFRASTRUCTURE
-- Run this in your Supabase SQL Editor

-- 1. Create Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  invitation_code TEXT UNIQUE NOT NULL,
  admin_id UUID REFERENCES public.profiles(id),
  subscription_tier TEXT DEFAULT 'FREE' CHECK (subscription_tier IN ('FREE', 'PRO', 'ELITE')),
  subscription_status TEXT DEFAULT 'active',
  max_painters INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Update Profiles Table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id);
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('painter', 'admin', 'super_admin'));

-- 3. RLS for Companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can view all companies" ON public.companies;
CREATE POLICY "Super admins can view all companies" ON public.companies FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

DROP POLICY IF EXISTS "Companies viewable by own admin" ON public.companies;
CREATE POLICY "Companies viewable by own admin" ON public.companies FOR SELECT TO authenticated USING (
    admin_id = auth.uid()
);

-- 4. RLS for Profiles
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
CREATE POLICY "Super admins can view all profiles" ON public.profiles FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- 5. Payments Enhancements
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id);

DROP POLICY IF EXISTS "Super admins can view all payments" ON public.payments;
CREATE POLICY "Super admins can view all payments" ON public.payments FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- 6. RPC for Analytics: Weekly Engagement
CREATE OR REPLACE FUNCTION public.get_weekly_engagement_stats()
RETURNS TABLE (day TEXT, value BIGINT) AS $$
BEGIN
    RETURN QUERY
    WITH days AS (
        SELECT unnest(ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) as d,
               generate_series(1, 7) as idx
    )
    SELECT 
        days.d as day,
        COUNT(up.id)::BIGINT as value
    FROM days
    LEFT JOIN public.user_progress up ON 
        to_char(up.last_watched_at, 'Dy') = days.d 
        AND up.last_watched_at > (NOW() - INTERVAL '7 days')
    GROUP BY days.d, days.idx
    ORDER BY days.idx;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
