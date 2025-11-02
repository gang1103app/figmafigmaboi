const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Signup
exports.signup = async (req, res) => {
  try {
    const { email, username, name, password } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, username, name, password_hash) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, username, name, level, xp, points, savings, co2_saved, streak, 
                 ecobuddy_name, ecobuddy_level, ecobuddy_mood, ecobuddy_accessories, created_at`,
      [email, username, name, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
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
        },
        friends: [],
        achievements: [],
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Get user's friends
    const friendsResult = await pool.query(
      `SELECT u.id, u.username, u.name, u.level, u.points, u.streak
       FROM users u
       INNER JOIN friendships f ON (f.friend_id = u.id)
       WHERE f.user_id = $1 AND f.status = 'accepted'`,
      [user.id]
    );

    // Get user's achievements
    const achievementsResult = await pool.query(
      'SELECT name, description, earned_at FROM achievements WHERE user_id = $1',
      [user.id]
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
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
        },
        friends: friendsResult.rows,
        achievements: achievementsResult.rows,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, username, name, level, xp, points, savings, co2_saved, streak,
              ecobuddy_name, ecobuddy_level, ecobuddy_mood, ecobuddy_accessories, created_at
       FROM users WHERE id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get user's friends
    const friendsResult = await pool.query(
      `SELECT u.id, u.username, u.name, u.level, u.points, u.streak
       FROM users u
       INNER JOIN friendships f ON (f.friend_id = u.id)
       WHERE f.user_id = $1 AND f.status = 'accepted'`,
      [user.id]
    );

    // Get user's achievements
    const achievementsResult = await pool.query(
      'SELECT name, description, earned_at FROM achievements WHERE user_id = $1',
      [user.id]
    );

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
      },
      friends: friendsResult.rows,
      achievements: achievementsResult.rows,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
