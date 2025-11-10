-- Add watering system columns to user_garden table
ALTER TABLE user_garden 
ADD COLUMN IF NOT EXISTS last_watered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS plant_state VARCHAR(20) DEFAULT 'healthy' CHECK (plant_state IN ('healthy', 'wilted', 'dead'));

-- Create index for querying plant states
CREATE INDEX IF NOT EXISTS idx_user_garden_state ON user_garden(user_id, plant_state);

-- Add task cycle tracking to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS task_cycle INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS task_reset_at TIMESTAMP;
