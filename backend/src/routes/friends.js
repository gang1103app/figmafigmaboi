const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/request', friendsController.sendFriendRequest);
router.put('/accept/:friendshipId', friendsController.acceptFriendRequest);
router.get('/', friendsController.getFriends);
router.get('/pending', friendsController.getPendingRequests);
router.delete('/:friendId', friendsController.removeFriend);
router.get('/activity', friendsController.getActivityFeed);

module.exports = router;
