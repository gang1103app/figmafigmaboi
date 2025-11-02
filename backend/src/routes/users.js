const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.put('/profile', userController.updateProfile);
router.get('/search', userController.searchUsers);
router.get('/:userId', userController.getUserProfile);

module.exports = router;
