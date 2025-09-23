const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const { authenticateToken } = require('../middleware/auth');

// Comments
router.post('/comment', authenticateToken, socialController.addComment);
router.get('/comments/:postId', socialController.getComments);

// Likes
router.post('/like', authenticateToken, socialController.likePost);
router.post('/unlike', authenticateToken, socialController.unlikePost);
router.get('/likes/:postId', socialController.getLikes);

// Reposts
router.post('/repost', authenticateToken, socialController.repost);
router.get('/reposts/:postId', socialController.getReposts);

// Shares
router.post('/share', authenticateToken, socialController.sharePost);

module.exports = router;
