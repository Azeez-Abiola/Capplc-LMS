-- SQL Fix for course constraint creation errors
-- Run this script in your Supabase SQL Editor

ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_level_check;
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_tier_access_check;

NOTIFY pgrst, 'reload schema';
