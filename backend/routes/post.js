const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../uploads'));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, uniqueSuffix + '-' + file.originalname);
	}
});
const upload = multer({ storage: storage });

// Create post with image upload
router.post('/', authenticateToken, upload.single('image'), postController.createPost);
// Get all posts
router.get('/', postController.getAllPosts);
// Get single post
router.get('/:id', postController.getPost);
// Get posts by user
router.get('/user/:userId', postController.getUserPosts);
// Update post
router.put('/:id', authenticateToken, postController.updatePost);
// Delete post
router.delete('/:id', authenticateToken, postController.deletePost);

module.exports = router;
