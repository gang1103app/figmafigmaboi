const pool = require('../config/database');

// Send friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;

    if (friendId == req.userId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if friend exists
    const friendCheck = await pool.query('SELECT id FROM users WHERE id = $1', [friendId]);
    if (friendCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if friendship already exists
    const existingFriendship = await pool.query(
      `SELECT * FROM friendships 
       WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
      [req.userId, friendId]
    );

    if (existingFriendship.rows.length > 0) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }

    // Create friend request
    await pool.query(
      'INSERT INTO friendships (user_id, friend_id, status) VALUES ($1, $2, $3)',
      [req.userId, friendId, 'pending']
    );

    res.status(201).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Accept friend request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { friendshipId } = req.params;

    // Update friendship status
    const result = await pool.query(
      `UPDATE friendships 
       SET status = 'accepted'
       WHERE id = $1 AND friend_id = $2 AND status = 'pending'
       RETURNING *`,
      [friendshipId, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    const friendship = result.rows[0];

    // Create reciprocal friendship
    await pool.query(
      'INSERT INTO friendships (user_id, friend_id, status) VALUES ($1, $2, $3)',
      [req.userId, friendship.user_id, 'accepted']
    );

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get friends list
exports.getFriends = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.name, u.level, u.points, u.streak,
              CASE WHEN u.updated_at > NOW() - INTERVAL '5 minutes' THEN 'online' ELSE 'offline' END as status
       FROM users u
       INNER JOIN friendships f ON (f.friend_id = u.id)
       WHERE f.user_id = $1 AND f.status = 'accepted'
       ORDER BY u.name`,
      [req.userId]
    );

    res.json(result.rows.map(friend => ({
      id: friend.id,
      username: friend.username,
      name: friend.name,
      level: friend.level,
      points: friend.points,
      streak: friend.streak,
      status: friend.status,
      avatar: '👤' // Default avatar
    })));
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get pending friend requests
exports.getPendingRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.id as friendship_id, u.id, u.username, u.name, u.level, u.points, f.created_at
       FROM friendships f
       INNER JOIN users u ON f.user_id = u.id
       WHERE f.friend_id = $1 AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove friend
exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;

    // Delete both directions of friendship
    await pool.query(
      `DELETE FROM friendships 
       WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
      [req.userId, friendId]
    );

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get activity feed from friends
exports.getActivityFeed = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.action, a.target, a.points, a.created_at,
              u.id as user_id, u.username, u.name
       FROM activities a
       INNER JOIN users u ON a.user_id = u.id
       INNER JOIN friendships f ON (f.friend_id = u.id AND f.user_id = $1 AND f.status = 'accepted')
       ORDER BY a.created_at DESC
       LIMIT 50`,
      [req.userId]
    );

    res.json(result.rows.map(activity => ({
      id: activity.id,
      user: activity.name,
      username: activity.username,
      avatar: '👤',
      action: activity.action,
      target: activity.target,
      points: activity.points,
      time: getTimeAgo(activity.created_at)
    })));
  } catch (error) {
    console.error('Get activity feed error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to format time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return `${Math.floor(seconds / 604800)} weeks ago`;
}
