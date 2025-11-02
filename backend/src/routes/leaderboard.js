const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', leaderboardController.getLeaderboard);
router.get('/rank', leaderboardController.getUserRank);

module.exports = router;
