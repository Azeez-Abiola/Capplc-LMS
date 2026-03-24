ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS video_url TEXT;

COMMENT ON COLUMN public.modules.duration IS 'Estimated duration of the course content';
COMMENT ON COLUMN public.modules.video_url IS 'Embed URL for video content (e.g. Vimeo)';

NOTIFY pgrst, 'reload schema';
