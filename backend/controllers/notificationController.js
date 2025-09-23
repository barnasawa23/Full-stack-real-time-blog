const notificationModel = require('../models/notification');

// Get notifications for logged-in user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationModel.getNotifications(userId);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    await notificationModel.markAsRead(userId, notificationId);
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
