-- FIX COURSES TABLE COLUMNS
-- Run this in your Supabase SQL Editor

-- 1. Ensure is_published column exists
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;

-- 2. Ensure thumbnail_url column exists (if thumbnail was used previously)
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- 3. Ensure duration column exists (as TEXT to match the backend controllers)
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '0';

-- 4. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
