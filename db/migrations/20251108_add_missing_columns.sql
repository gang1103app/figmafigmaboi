-- Migration: add missing columns referenced by v1.5
-- Run with psql -d <dbname> -f db/migrations/20251108_add_missing_columns.sql
BEGIN;

-- user_progress: last_login_date used by streak logic, seeds used by leaderboard, best_streak used too
ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS last_login_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS seeds INTEGER NOT NULL DEFAULT 0;

ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS best_streak INTEGER NOT NULL DEFAULT 0;

-- user_challenges: updated_at used when updating progress
ALTER TABLE user_challenges
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

COMMIT;
