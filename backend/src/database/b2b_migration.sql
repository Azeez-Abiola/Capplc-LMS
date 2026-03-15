-- ── B2B INFRASTRUCTURE: COMPANIES ──
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  invitation_code TEXT UNIQUE NOT NULL,
  admin_id UUID REFERENCES public.profiles(id),
  subscription_tier TEXT DEFAULT 'FREE' CHECK (subscription_tier IN ('FREE', 'PRO', 'ELITE')),
  subscription_status TEXT DEFAULT 'active',
  max_painters INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add company_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id);

-- Update RLS for Companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies viewable by super admins" ON public.companies FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Companies viewable by own admin" ON public.companies FOR SELECT TO authenticated USING (
    admin_id = auth.uid()
);

-- Update handle_new_user to link company by code
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    found_company_id UUID;
BEGIN
    -- Check if a company code was provided in metadata
    IF (NEW.raw_user_meta_data->>'company_code') IS NOT NULL THEN
        SELECT id INTO found_company_id FROM public.companies WHERE invitation_code = NEW.raw_user_meta_data->>'company_code';
    END IF;

    INSERT INTO public.profiles (id, first_name, last_name, email, phone, state, company_code, company_id, role)
    VALUES (
        NEW.id, 
        NEW.raw_user_meta_data->>'first_name', 
        NEW.raw_user_meta_data->>'last_name', 
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'state',
        NEW.raw_user_meta_data->>'company_code',
        found_company_id,
        COALESCE(NEW.raw_user_meta_data->>'role', 'painter')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
