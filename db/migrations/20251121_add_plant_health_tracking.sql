-- Add plant health tracking to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS plant_health INTEGER DEFAULT 3 CHECK (plant_health >= 0 AND plant_health <= 3),
ADD COLUMN IF NOT EXISTS last_watered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS consecutive_water_days INTEGER DEFAULT 0;

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_users_last_watered ON users(last_watered_at);
