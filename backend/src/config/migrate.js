import pool from './database.js';

/**
 * Creates database tables and inserts initial data
 * Can be called from CLI or as a function from other modules
 * @param {boolean} exitOnComplete - Whether to exit process after completion (default: true for CLI usage)
 */
export const createTables = async (exitOnComplete = true) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Creating tables...');
    
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');
    
    // User progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0,
        seeds INTEGER DEFAULT 0,
        total_savings DECIMAL(10, 2) DEFAULT 0,
        co2_saved DECIMAL(10, 2) DEFAULT 0,
        streak INTEGER DEFAULT 0,
        best_streak INTEGER DEFAULT 0,
        last_login_date TIMESTAMP WITH TIME ZONE,
        last_activity_date DATE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ User progress table created');
    
    // EcoBuddy table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_ecobuddy (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(50) DEFAULT 'EcoBuddy',
        level INTEGER DEFAULT 1,
        accessories JSONB DEFAULT '[]',
        mood VARCHAR(20) DEFAULT 'happy',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ EcoBuddy table created');
    
    // Achievements table
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(10) NOT NULL,
        requirement_type VARCHAR(50) NOT NULL,
        requirement_value INTEGER NOT NULL
      )
    `);
    console.log('✅ Achievements table created');
    
    // User achievements table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
        unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, achievement_id)
      )
    `);
    console.log('✅ User achievements table created');
    
    // Challenges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS challenges (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        difficulty VARCHAR(20) NOT NULL,
        points INTEGER NOT NULL,
        category VARCHAR(50) NOT NULL,
        target_value INTEGER,
        duration_days INTEGER DEFAULT 7
      )
    `);
    console.log('✅ Challenges table created');
    
    // User challenges table (tracks progress and completion)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_challenges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'active',
        progress INTEGER DEFAULT 0,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        points_earned INTEGER DEFAULT 0
      )
    `);
    console.log('✅ User challenges table created');
    
    // Energy usage table (for analytics)
    await client.query(`
      CREATE TABLE IF NOT EXISTS energy_usage (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        category VARCHAR(50) NOT NULL,
        usage_kwh DECIMAL(10, 2) NOT NULL,
        savings_kwh DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, date, category)
      )
    `);
    console.log('✅ Energy usage table created');
    
    // Friends table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_friends (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        friend_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, friend_id),
        CHECK (user_id != friend_id)
      )
    `);
    console.log('✅ Friends table created');
    
    // User energy survey table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_energy_survey (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        location VARCHAR(255),
        state_code VARCHAR(10),
        electricity_rate DECIMAL(10, 4),
        household_size INTEGER,
        home_type VARCHAR(50),
        heating_type VARCHAR(50),
        cooling_type VARCHAR(50),
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ User energy survey table created');
    
    // Daily progress tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_daily_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        tasks_completed INTEGER DEFAULT 0,
        seeds_earned INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, date)
      )
    `);
    console.log('✅ Daily progress table created');
    
    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_friends_user_id ON user_friends(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_friends_friend_id ON user_friends(friend_id);
      CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
      CREATE INDEX IF NOT EXISTS idx_energy_usage_user_date ON energy_usage(user_id, date);
      CREATE INDEX IF NOT EXISTS idx_user_daily_progress_user_date ON user_daily_progress(user_id, date);
    `);
    console.log('✅ Database indexes created');
    
    // Insert default achievements
    await client.query(`
      INSERT INTO achievements (name, description, icon, requirement_type, requirement_value)
      VALUES 
        ('First Place', 'Reached #1 on leaderboard', '🥇', 'rank', 1),
        ('Hot Streak', '30-day consecutive streak', '🔥', 'streak', 30),
        ('Century Club', 'Saved $100 or more', '💯', 'savings', 100),
        ('Planet Protector', 'Saved 200kg CO₂', '🌍', 'co2', 200),
        ('Energy Expert', 'Complete 50 challenges', '⚡', 'challenges', 50),
        ('Eco Royalty', 'Reach level 20', '👑', 'level', 20)
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Default achievements inserted');
    
    // Insert sample challenges
    await client.query(`
      INSERT INTO challenges (title, description, difficulty, points, category, target_value, duration_days)
      VALUES 
        ('Unplug Unused Devices', 'Unplug 5 devices when not in use', 'Easy', 50, 'appliances', 5, 7),
        ('Natural Light Day', 'Use only natural light during daytime', 'Medium', 100, 'lighting', 1, 1),
        ('Thermostat Challenge', 'Lower thermostat by 2°F for a week', 'Medium', 150, 'heating', 7, 7),
        ('Vampire Power Hunt', 'Find and eliminate 10 standby power sources', 'Hard', 200, 'appliances', 10, 14),
        ('LED Upgrade', 'Replace 5 bulbs with LED', 'Easy', 75, 'lighting', 5, 30),
        ('Cold Wash Week', 'Use cold water for laundry for 7 days', 'Medium', 100, 'appliances', 7, 7),
        ('Shower Timer', 'Take 5-minute showers for a week', 'Medium', 120, 'water', 7, 7),
        ('Zero Phantom Load', 'Eliminate all phantom power for 24 hours', 'Hard', 250, 'appliances', 1, 1),
        ('Screen Time Reduction', 'Reduce screen time by 1 hour daily for a week', 'Medium', 100, 'general', 7, 7),
        ('Air Dry Dishes', 'Air dry dishes instead of using dishwasher heat dry', 'Easy', 60, 'appliances', 7, 7),
        ('Power Strip Switch', 'Use power strips and turn them off when not in use', 'Easy', 50, 'appliances', 1, 7),
        ('Window Insulation', 'Check and improve window insulation', 'Medium', 120, 'heating', 1, 14),
        ('Fridge Temperature', 'Optimize fridge and freezer temperature settings', 'Easy', 40, 'appliances', 1, 1),
        ('Eco-Mode Challenge', 'Use eco-mode on all appliances for a week', 'Easy', 70, 'appliances', 7, 7),
        ('Laptop Power Saving', 'Enable power saving mode on computer devices', 'Easy', 45, 'appliances', 1, 1),
        ('Smart Thermostat', 'Program thermostat with energy-saving schedule', 'Medium', 130, 'heating', 1, 14),
        ('Ceiling Fan Usage', 'Use ceiling fans instead of AC when possible', 'Medium', 110, 'heating', 7, 7),
        ('Microwave Over Oven', 'Use microwave instead of oven when possible', 'Easy', 55, 'appliances', 7, 7),
        ('Dryer Lint Check', 'Clean dryer lint filter before each use', 'Easy', 35, 'appliances', 7, 7),
        ('Energy Audit', 'Conduct a home energy audit and identify savings', 'Hard', 200, 'general', 1, 14),
        ('Smart Lighting', 'Install smart bulbs and optimize lighting schedules', 'Medium', 140, 'lighting', 5, 21),
        ('Weatherstripping', 'Install weatherstripping on doors and windows', 'Medium', 160, 'heating', 1, 14)
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Sample challenges inserted');
    
    // Garden items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS garden_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('plant', 'background')),
        image_path VARCHAR(500) NOT NULL,
        cost_seeds INTEGER NOT NULL DEFAULT 100,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Garden items table created');
    
    // User garden table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_garden (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        item_id INTEGER NOT NULL REFERENCES garden_items(id) ON DELETE CASCADE,
        position_x INTEGER DEFAULT 0,
        position_y INTEGER DEFAULT 0,
        purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);
    console.log('✅ User garden table created');
    
    // User active background table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_garden_background (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        background_id INTEGER REFERENCES garden_items(id) ON DELETE SET NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ User garden background table created');
    
    // Create garden indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_garden_user_id ON user_garden(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_garden_background_user_id ON user_garden_background(user_id);
    `);
    console.log('✅ Garden indexes created');
    
    // Insert plant items - NEW ARTWORK FROM /public FOLDER
    await client.query(`
      INSERT INTO garden_items (name, item_type, image_path, cost_seeds, description) VALUES
        ('Light Pink Tulip', 'plant', '/LightPinkTulip.png', 100, 'A delicate light pink tulip'),
        ('Red Tulip', 'plant', '/RedTulip.png', 100, 'A vibrant red tulip'),
        ('Yellow Tulip', 'plant', '/YellowTulip.png', 100, 'A cheerful yellow tulip'),
        ('Purple Tulip', 'plant', '/PurpleTulip.png', 100, 'An elegant purple tulip'),
        ('White Tulip', 'plant', '/WhiteTulip.png', 100, 'A pure white tulip'),
        ('Pink Rose', 'plant', '/PinkRose.png', 120, 'A beautiful pink rose'),
        ('Red Rose', 'plant', '/RedRose.png', 120, 'A classic red rose'),
        ('Yellow Rose', 'plant', '/YellowRose.png', 120, 'A sunny yellow rose'),
        ('Sunflower', 'plant', '/Sunflower.png', 150, 'A bright and cheerful sunflower'),
        ('Daisy', 'plant', '/Daisy.png', 80, 'A simple and sweet daisy'),
        ('Lavender', 'plant', '/Lavender.png', 110, 'Fragrant purple lavender'),
        ('Marigold', 'plant', '/Marigold.png', 90, 'A vibrant orange marigold'),
        ('Petunia', 'plant', '/Petunia.png', 95, 'A colorful petunia'),
        ('Orchid', 'plant', '/Orchid.png', 180, 'An exotic and elegant orchid'),
        ('Lily', 'plant', '/Lily.png', 140, 'A graceful white lily'),
        ('Carnation', 'plant', '/Carnation.png', 85, 'A ruffled carnation flower'),
        ('Hydrangea', 'plant', '/Hydrangea.png', 160, 'A lush hydrangea bloom'),
        ('Poppy', 'plant', '/Poppy.png', 105, 'A delicate red poppy'),
        ('Abstract Garden', 'background', '/backgrounds/AbstractGarden.jpg', 300, 'Abstract artistic garden background'),
        ('Backyard', 'background', '/backgrounds/Backyard.jpg', 250, 'Cozy backyard setting'),
        ('Sunset Garden', 'background', '/backgrounds/SunsetGarden.jpg', 350, 'Beautiful sunset garden view')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Garden items inserted');
    
    await client.query('COMMIT');
    console.log('✅ Database migration completed successfully!');
    
    return { success: true, message: 'Database migration completed successfully!' };
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    // Only close pool when running from CLI
    if (exitOnComplete) {
      await pool.end();
    }
  }
};

// Run migration when called directly from CLI
// Check if this file is being run directly (not imported)
const isRunDirectly = process.argv[1] && process.argv[1].endsWith('migrate.js');
if (isRunDirectly) {
  createTables(true).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
