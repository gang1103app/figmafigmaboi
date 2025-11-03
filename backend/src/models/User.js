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
        'SELECT id, email, username, name, created_at FROM users WHERE id = $1',
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
        `SELECT c.*, uc.status, uc.progress, uc.started_at, uc.completed_at, uc.points_earned
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
        totalSavings: parseFloat(progress.total_savings),
        co2Saved: parseFloat(progress.co2_saved),
        streak: progress.streak,
        bestStreak: progress.best_streak,
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
}

export default User;
