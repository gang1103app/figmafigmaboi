import pool from '../config/database.js';
import bcrypt from 'bcrypt';

class User {
  static async create(userData) {
    const { email, username, password, name } = userData;
    const passwordHash = await bcrypt.hash(password, 10);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Create user
      const userResult = await client.query(
        `INSERT INTO users (email, username, password_hash, name)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, username, name, created_at`,
        [email, username, passwordHash, name]
      );
      
      const user = userResult.rows[0];
      
      // Create initial user progress
      await client.query(
        `INSERT INTO user_progress (user_id)
         VALUES ($1)`,
        [user.id]
      );
      
      // Create initial EcoBuddy
      await client.query(
        `INSERT INTO user_ecobuddy (user_id)
         VALUES ($1)`,
        [user.id]
      );
      
      // Set default free background (Chill Background)
      const defaultBgResult = await client.query(
        `SELECT id FROM garden_items WHERE name = 'Chill Background' AND item_type = 'background'`
      );
      
      if (defaultBgResult.rows.length > 0) {
        await client.query(
          `INSERT INTO user_garden_background (user_id, background_id)
           VALUES ($1, $2)`,
          [user.id, defaultBgResult.rows[0].id]
        );
      }
      
      await client.query('COMMIT');
      return user;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }
  
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, username, name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
  
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  static async getFullProfile(userId) {
    const client = await pool.connect();
    try {
      // Get user basic info
      const userResult = await client.query(
        'SELECT id, email, username, name, created_at, plant_health, last_watered_at FROM users WHERE id = $1',
        [userId]
      );
      const user = userResult.rows[0];
      
      if (!user) return null;
      
      // Get user progress
      const progressResult = await client.query(
        'SELECT * FROM user_progress WHERE user_id = $1',
        [userId]
      );
      const progress = progressResult.rows[0];
      
      // Get EcoBuddy
      const ecobuddyResult = await client.query(
        'SELECT * FROM user_ecobuddy WHERE user_id = $1',
        [userId]
      );
      const ecobuddy = ecobuddyResult.rows[0];
      
      // Get achievements
      const achievementsResult = await client.query(
        `SELECT a.*, ua.unlocked_at
         FROM achievements a
         LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
         ORDER BY a.id`,
        [userId]
      );
      
      // Get active challenges
      const challengesResult = await client.query(
        `SELECT 
          c.id as challenge_id,
          c.title,
          c.description,
          c.difficulty,
          c.points,
          c.category,
          c.target_value,
          c.duration_days,
          uc.id as user_challenge_id,
          uc.status,
          uc.progress,
          uc.started_at,
          uc.completed_at,
          uc.points_earned
         FROM user_challenges uc
         JOIN challenges c ON uc.challenge_id = c.id
         WHERE uc.user_id = $1
         ORDER BY uc.started_at DESC`,
        [userId]
      );
      
      return {
        ...user,
        level: progress.level,
        xp: progress.xp,
        points: progress.points,
        seeds: progress.seeds || 0,
        totalSavings: parseFloat(progress.total_savings),
        co2Saved: parseFloat(progress.co2_saved),
        streak: progress.streak,
        bestStreak: progress.best_streak,
        lastLoginDate: progress.last_login_date,
        completedTaskIds: progress.completed_task_ids || [],
        plantHealth: user.plant_health !== null ? user.plant_health : 3,
        lastWateredAt: user.last_watered_at,
        ecobuddy: {
          name: ecobuddy.name,
          level: ecobuddy.level,
          accessories: ecobuddy.accessories,
          mood: ecobuddy.mood
        },
        achievements: achievementsResult.rows,
        challenges: challengesResult.rows
      };
    } finally {
      client.release();
    }
  }
  
  static async updateProgress(userId, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    if (updates.level !== undefined) {
      fields.push(`level = $${paramCount++}`);
      values.push(updates.level);
    }
    if (updates.xp !== undefined) {
      fields.push(`xp = $${paramCount++}`);
      values.push(updates.xp);
    }
    if (updates.points !== undefined) {
      fields.push(`points = $${paramCount++}`);
      values.push(updates.points);
    }
    if (updates.seeds !== undefined) {
      fields.push(`seeds = $${paramCount++}`);
      values.push(updates.seeds);
    }
    if (updates.totalSavings !== undefined) {
      fields.push(`total_savings = $${paramCount++}`);
      values.push(updates.totalSavings);
    }
    if (updates.co2Saved !== undefined) {
      fields.push(`co2_saved = $${paramCount++}`);
      values.push(updates.co2Saved);
    }
    if (updates.streak !== undefined) {
      fields.push(`streak = $${paramCount++}`);
      values.push(updates.streak);
    }
    if (updates.bestStreak !== undefined) {
      fields.push(`best_streak = $${paramCount++}`);
      values.push(updates.bestStreak);
    }
    if (updates.lastLoginDate !== undefined) {
      fields.push(`last_login_date = $${paramCount++}`);
      values.push(updates.lastLoginDate);
    }
    if (updates.completedTaskIds !== undefined) {
      fields.push(`completed_task_ids = $${paramCount++}`);
      values.push(JSON.stringify(updates.completedTaskIds));
    }
    
    if (fields.length === 0) return null;
    
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);
    
    const query = `
      UPDATE user_progress 
      SET ${fields.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async updateStreak(userId) {
    const result = await pool.query(
      'SELECT last_login_date, streak, best_streak FROM user_progress WHERE user_id = $1',
      [userId]
    );
    
    if (!result.rows[0]) return null;
    
    const { last_login_date, streak, best_streak } = result.rows[0];
    const today = new Date().toISOString().split('T')[0];
    
    // If already logged in today, no update needed
    // Compare just the date part
    if (last_login_date) {
      const lastLoginDateStr = new Date(last_login_date).toISOString().split('T')[0];
      if (lastLoginDateStr === today) {
        return { streak, bestStreak: best_streak };
      }
    }
    
    let newStreak = streak;
    let newBestStreak = best_streak;
    
    if (!last_login_date) {
      // First login
      newStreak = 1;
    } else {
      const lastDate = new Date(last_login_date);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        newStreak = streak + 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    }
    
    newBestStreak = Math.max(newStreak, best_streak);
    
    await pool.query(
      `UPDATE user_progress 
       SET streak = $1, best_streak = $2, last_login_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $3`,
      [newStreak, newBestStreak, userId]
    );
    
    return { streak: newStreak, bestStreak: newBestStreak };
  }
}

export default User;
