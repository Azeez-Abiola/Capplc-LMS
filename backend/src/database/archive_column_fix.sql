-- Add missing archived_at column to courses table to fix course archive failing
ALTER TABLE courses ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
