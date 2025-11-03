import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { writeLimiter } from '../middleware/rateLimiter.js';
import pool from '../config/database.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get full user profile
router.get('/profile', async (req, res) => {
  try {
    const profile = await User.getFullProfile(req.user.userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user progress
router.patch('/progress',
  writeLimiter,
  [
    body('level').optional().isInt({ min: 1 }),
    body('xp').optional().isInt({ min: 0 }),
    body('points').optional().isInt({ min: 0 }),
    body('totalSavings').optional().isFloat({ min: 0 }),
    body('co2Saved').optional().isFloat({ min: 0 }),
    body('streak').optional().isInt({ min: 0 }),
    body('bestStreak').optional().isInt({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const progress = await User.updateProgress(req.user.userId, req.body);
      res.json({ message: 'Progress updated', progress });
    } catch (error) {
      console.error('Update progress error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update EcoBuddy
router.patch('/ecobuddy',
  writeLimiter,
  [
    body('name').optional().isLength({ min: 1, max: 50 }),
    body('level').optional().isInt({ min: 1 }),
    body('accessories').optional().isArray(),
    body('mood').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, level, accessories, mood } = req.body;
      const fields = [];
      const values = [];
      let paramCount = 1;

      if (name) {
        fields.push(`name = $${paramCount++}`);
        values.push(name);
      }
      if (level) {
        fields.push(`level = $${paramCount++}`);
        values.push(level);
      }
      if (accessories) {
        fields.push(`accessories = $${paramCount++}`);
        values.push(JSON.stringify(accessories));
      }
      if (mood) {
        fields.push(`mood = $${paramCount++}`);
        values.push(mood);
      }

      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(req.user.userId);

      const query = `
        UPDATE user_ecobuddy
        SET ${fields.join(', ')}
        WHERE user_id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      res.json({ message: 'EcoBuddy updated', ecobuddy: result.rows[0] });
    } catch (error) {
      console.error('Update EcoBuddy error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get available challenges
router.get('/challenges/available', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*
      FROM challenges c
      WHERE c.id NOT IN (
        SELECT challenge_id FROM user_challenges WHERE user_id = $1
      )
      ORDER BY c.difficulty, c.points
    `, [req.user.userId]);

    res.json({ challenges: result.rows });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start a challenge
router.post('/challenges/:challengeId/start', writeLimiter, async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    // Check if challenge exists
    const challengeResult = await pool.query('SELECT * FROM challenges WHERE id = $1', [challengeId]);
    if (challengeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Add challenge to user's active challenges
    const result = await pool.query(`
      INSERT INTO user_challenges (user_id, challenge_id, status)
      VALUES ($1, $2, 'active')
      RETURNING *
    `, [req.user.userId, challengeId]);

    res.json({ message: 'Challenge started', userChallenge: result.rows[0] });
  } catch (error) {
    console.error('Start challenge error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Challenge already started' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update challenge progress
router.patch('/challenges/:challengeId/progress',
  writeLimiter,
  [
    body('progress').isInt({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { challengeId } = req.params;
      const { progress } = req.body;

      const result = await pool.query(`
        UPDATE user_challenges
        SET progress = $1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2 AND challenge_id = $3
        RETURNING *
      `, [progress, req.user.userId, challengeId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Challenge not found' });
      }

      res.json({ message: 'Progress updated', userChallenge: result.rows[0] });
    } catch (error) {
      console.error('Update challenge progress error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Complete a challenge
router.post('/challenges/:challengeId/complete', writeLimiter, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { challengeId } = req.params;

    // Get challenge details
    const challengeResult = await client.query('SELECT * FROM challenges WHERE id = $1', [challengeId]);
    if (challengeResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const challenge = challengeResult.rows[0];

    // Update challenge status
    await client.query(`
      UPDATE user_challenges
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP, points_earned = $1
      WHERE user_id = $2 AND challenge_id = $3
    `, [challenge.points, req.user.userId, challengeId]);

    // Update user points
    await client.query(`
      UPDATE user_progress
      SET points = points + $1, xp = xp + $2
      WHERE user_id = $3
    `, [challenge.points, challenge.points * 2, req.user.userId]);

    await client.query('COMMIT');
    res.json({ 
      message: 'Challenge completed!', 
      pointsEarned: challenge.points,
      xpEarned: challenge.points * 2
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Complete challenge error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.username, u.name,
        up.points, up.total_savings, up.co2_saved, up.streak, up.level
      FROM users u
      JOIN user_progress up ON u.id = up.user_id
      ORDER BY up.points DESC
      LIMIT 100
    `);

    res.json({ leaderboard: result.rows });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Log energy usage
router.post('/energy-usage',
  writeLimiter,
  [
    body('date').isISO8601().withMessage('Date must be in ISO 8601 format'),
    body('category').notEmpty(),
    body('usage_kwh').isFloat({ min: 0 }),
    body('savings_kwh').optional().isFloat({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { date, category, usage_kwh, savings_kwh } = req.body;
      
      const result = await pool.query(`
        INSERT INTO energy_usage (user_id, date, category, usage_kwh, savings_kwh)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id, date, category)
        DO UPDATE SET usage_kwh = $4, savings_kwh = $5
        RETURNING *
      `, [req.user.userId, date, category, usage_kwh, savings_kwh || 0]);

      res.json({ message: 'Energy usage logged', data: result.rows[0] });
    } catch (error) {
      console.error('Log energy usage error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get energy usage analytics
router.get('/energy-usage', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT * FROM energy_usage
      WHERE user_id = $1
    `;
    const params = [req.user.userId];
    
    if (startDate) {
      query += ` AND date >= $${params.length + 1}`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND date <= $${params.length + 1}`;
      params.push(endDate);
    }
    
    query += ' ORDER BY date DESC';
    
    const result = await pool.query(query, params);
    res.json({ energyUsage: result.rows });
  } catch (error) {
    console.error('Get energy usage error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
