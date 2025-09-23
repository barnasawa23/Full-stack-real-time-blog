
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');

// User search
router.get('/search/users', profileController.searchUsers);

// Get user profile
router.get('/:id', profileController.getProfile);
// Update own profile
router.put('/', authenticateToken, profileController.updateProfile);
// Follow a user
router.post('/follow/:id', authenticateToken, profileController.follow);
// Unfollow a user
router.post('/unfollow/:id', authenticateToken, profileController.unfollow);
// Get followers
router.get('/:id/followers', profileController.getFollowers);
// Get following
router.get('/:id/following', profileController.getFollowing);

module.exports = router;
