const pool = require('../config/database');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { points, xp, level, savings, co2Saved, streak, ecobuddy } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (points !== undefined) {
      updates.push(`points = $${paramCount++}`);
      values.push(points);
    }
    if (xp !== undefined) {
      updates.push(`xp = $${paramCount++}`);
      values.push(xp);
    }
    if (level !== undefined) {
      updates.push(`level = $${paramCount++}`);
      values.push(level);
    }
    if (savings !== undefined) {
      updates.push(`savings = $${paramCount++}`);
      values.push(savings);
    }
    if (co2Saved !== undefined) {
      updates.push(`co2_saved = $${paramCount++}`);
      values.push(co2Saved);
    }
    if (streak !== undefined) {
      updates.push(`streak = $${paramCount++}`);
      values.push(streak);
    }
    if (ecobuddy) {
      if (ecobuddy.name) {
        updates.push(`ecobuddy_name = $${paramCount++}`);
        values.push(ecobuddy.name);
      }
      if (ecobuddy.level) {
        updates.push(`ecobuddy_level = $${paramCount++}`);
        values.push(ecobuddy.level);
      }
      if (ecobuddy.mood) {
        updates.push(`ecobuddy_mood = $${paramCount++}`);
        values.push(ecobuddy.mood);
      }
      if (ecobuddy.accessories) {
        updates.push(`ecobuddy_accessories = $${paramCount++}`);
        values.push(ecobuddy.accessories);
      }
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.userId);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, username, name, level, xp, points, savings, co2_saved, streak,
                ecobuddy_name, ecobuddy_level, ecobuddy_mood, ecobuddy_accessories
    `;

    const result = await pool.query(query, values);
    const user = result.rows[0];

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      level: user.level,
      xp: user.xp,
      points: user.points,
      savings: parseFloat(user.savings),
      co2Saved: parseFloat(user.co2_saved),
      streak: user.streak,
      ecobuddy: {
        name: user.ecobuddy_name,
        level: user.ecobuddy_level,
        mood: user.ecobuddy_mood,
        accessories: user.ecobuddy_accessories
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search users by username
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const result = await pool.query(
      `SELECT id, username, name, level, points, streak
       FROM users
       WHERE username ILIKE $1 OR name ILIKE $1
       AND id != $2
       LIMIT 20`,
      [`%${query}%`, req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT id, username, name, level, points, savings, co2_saved, streak, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get achievements
    const achievementsResult = await pool.query(
      'SELECT name, description, earned_at FROM achievements WHERE user_id = $1',
      [userId]
    );

    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      level: user.level,
      points: user.points,
      savings: parseFloat(user.savings),
      co2Saved: parseFloat(user.co2_saved),
      streak: user.streak,
      achievements: achievementsResult.rows,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
