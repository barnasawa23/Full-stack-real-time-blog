const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

// Get notifications for logged-in user
router.get('/', authenticateToken, notificationController.getNotifications);
// Mark a notification as read
router.put('/:id/read', authenticateToken, notificationController.markAsRead);

module.exports = router;
