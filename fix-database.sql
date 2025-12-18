-- SQL script to fix the database schema after removing estimatedHours
-- Run this in your PostgreSQL database

-- Remove the estimatedHours column if it exists
ALTER TABLE homeworks DROP COLUMN IF EXISTS "estimatedHours";

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'homeworks' 
ORDER BY ordinal_position;

