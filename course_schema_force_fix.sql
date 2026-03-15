-- Super aggressive schema fix and cache clear
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Ensure the columns exist and are accessible
COMMENT ON COLUMN courses.is_published IS 'Visibility status of the course';
COMMENT ON COLUMN courses.thumbnail_url IS 'URL for the course thumbnail image';
COMMENT ON COLUMN courses.duration IS 'Estimated time to complete the course';

-- FORCE SCHEMA RELOAD (Multiple methods)
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- If the above doesn't work, this sometimes helps by making a dummy change
COMMENT ON TABLE courses IS 'Enterprise course and module registry';

-- Final check query
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' AND column_name IN ('is_published', 'thumbnail_url', 'duration');
