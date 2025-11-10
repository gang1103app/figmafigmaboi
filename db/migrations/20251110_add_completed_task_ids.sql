-- Migration: Add completed_task_ids column to user_progress table
-- This column is used to track which tasks a user has completed
-- Run with psql -d <dbname> -f db/migrations/20251110_add_completed_task_ids.sql
BEGIN;

-- Add completed_task_ids column if it doesn't exist
ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS completed_task_ids JSONB DEFAULT '[]';

COMMIT;
