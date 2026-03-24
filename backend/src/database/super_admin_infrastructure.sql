-- ── SUPER ADMIN DATA ACCESS & ANALYTICS ──

-- 1. Ensure Super Admin can view all profiles
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
CREATE POLICY "Super admins can view all profiles" ON public.profiles FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- 2. Update Companies Policy to include super_admin
DROP POLICY IF EXISTS "Companies viewable by super admins" ON public.companies;
CREATE POLICY "Companies viewable by super admins" ON public.companies FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- 3. Payments: Add company_id and update RLS
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id);

DROP POLICY IF EXISTS "Super admins can view all payments" ON public.payments;
CREATE POLICY "Super admins can view all payments" ON public.payments FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- 4. Courses, Enrollments, Certificates, Subscriptions RLS for Super Admin
CREATE POLICY "Super admins can view all courses" ON public.courses FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

CREATE POLICY "Super admins can view all enrollments" ON public.enrollments FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

CREATE POLICY "Super admins can view all certificates" ON public.certificates FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

CREATE POLICY "Super admins can view all subscriptions" ON public.subscriptions FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- 5. Analytics RPC: Weekly Engagement Stats
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
