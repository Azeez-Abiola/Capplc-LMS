-- CORE SCHEMAS FOR PAYMENTS AND CERTIFICATES
-- Run this in your Supabase SQL Editor if you see 500 errors on Admin Dashboard

-- 1. Ensure course_categories table
CREATE TABLE IF NOT EXISTS public.course_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  category_id UUID REFERENCES public.course_categories(id),
  tier_access TEXT DEFAULT 'free', -- 'free', 'PRO', 'ELITE'
  thumbnail_url TEXT,
  level TEXT DEFAULT 'Beginner',
  duration TEXT,
  rating DECIMAL DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ensure certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_url TEXT NOT NULL,
  serial_no TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  company_id UUID REFERENCES public.companies(id)
);

-- 4. Ensure payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  reference TEXT UNIQUE NOT NULL,
  payment_method TEXT,
  tier_id TEXT, -- References the tier name or ID
  company_id UUID REFERENCES public.companies(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Ensure subscription_tiers table (if used in joins)
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- 'FREE', 'PRO', 'ELITE'
  price DECIMAL NOT NULL,
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Ensure subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES public.subscription_tiers(id),
  status TEXT DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  last_payment_ref TEXT REFERENCES public.payments(reference),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADD MISSING RLS POLICIES FOR ADMIN
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

DROP POLICY IF EXISTS "Admins can view all certificates" ON public.certificates;
CREATE POLICY "Admins can view all certificates" ON public.certificates FOR SELECT TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
);
