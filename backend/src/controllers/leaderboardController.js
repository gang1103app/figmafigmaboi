const pool = require('../config/database');

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const { timeframe = 'all' } = req.query;
    
    let dateFilter = '';
    if (timeframe === 'week') {
      dateFilter = "AND created_at > NOW() - INTERVAL '7 days'";
    } else if (timeframe === 'month') {
      dateFilter = "AND created_at > NOW() - INTERVAL '30 days'";
    }

    const result = await pool.query(
      `SELECT 
        u.id,
        u.username,
        u.name,
        u.points,
        u.savings,
        u.streak,
        u.level,
        ROW_NUMBER() OVER (ORDER BY u.points DESC) as rank
       FROM users u
       WHERE 1=1 ${dateFilter}
       ORDER BY u.points DESC
       LIMIT 100`,
      []
    );

    // Find current user's position
    const userRank = result.rows.findIndex(row => row.id == req.userId);

    res.json({
      leaderboard: result.rows.map((user, index) => ({
        rank: index + 1,
        id: user.id,
        name: user.name,
        username: user.username,
        points: user.points,
        savings: parseFloat(user.savings),
        streak: user.streak,
        badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐',
        isUser: user.id == req.userId
      })),
      userRank: userRank >= 0 ? userRank + 1 : null
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user rank
exports.getUserRank = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) + 1 as rank
       FROM users
       WHERE points > (SELECT points FROM users WHERE id = $1)`,
      [req.userId]
    );

    const userResult = await pool.query(
      'SELECT points, savings, streak FROM users WHERE id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    res.json({
      rank: parseInt(result.rows[0].rank),
      points: user.points,
      savings: parseFloat(user.savings),
      streak: user.streak
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
