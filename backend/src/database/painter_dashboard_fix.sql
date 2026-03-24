-- COMPREHENSIVE SCHEMA FIX FOR PAINTER DASHBOARD
-- This ensures all columns, relationships, and tables exist for the Painter's view

-- 1. Ensure tier_access column exists on courses
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='tier_access') THEN
    ALTER TABLE public.courses ADD COLUMN tier_access TEXT DEFAULT 'free';
  END IF;
END $$;

-- 2. Ensure relationships for subscriptions
-- First, ensure the tables exist (from previous scripts)
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price DECIMAL NOT NULL,
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES public.subscription_tiers(id),
  status TEXT DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure the Foreign Key is explicitly defined if not already
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'subscriptions_tier_id_fkey'
    ) THEN
        ALTER TABLE public.subscriptions 
        ADD CONSTRAINT subscriptions_tier_id_fkey 
        FOREIGN KEY (tier_id) REFERENCES public.subscription_tiers(id);
    END IF;
END $$;

-- 3. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'INFO', -- 'INFO', 'SUCCESS', 'ALERT'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 4. Sample Data for Tiers (if they don't exist)
INSERT INTO public.subscription_tiers (name, price, features)
VALUES 
  ('FREE', 0, ARRAY['Standard Courses', 'Community Access']),
  ('PRO', 5000, ARRAY['Advanced Courses', 'Offline Downloads', 'Certificates']),
  ('ELITE', 15000, ARRAY['All Courses', '1-on-1 Mentorship', 'Global Certification'])
ON CONFLICT (name) DO NOTHING;
