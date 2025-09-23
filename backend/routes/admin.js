const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All routes below require admin
router.use(authenticateToken, requireAdmin);

router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/admin', adminController.setAdmin);
router.put('/users/:id/active', adminController.setActiveStatus);

router.get('/posts', adminController.getAllPosts);
router.delete('/posts/:id', adminController.deletePost);

module.exports = router;
