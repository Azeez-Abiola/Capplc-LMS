-- Adds video_url to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS video_url TEXT;
