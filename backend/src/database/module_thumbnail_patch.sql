-- Add thumbnail_url to modules table
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

COMMENT ON COLUMN public.modules.thumbnail_url IS 'Thumbnail image URL for the specific course/lesson';

NOTIFY pgrst, 'reload schema';
