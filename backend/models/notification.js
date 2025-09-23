const db = require('../db');

const createNotification = async (userId, type, actorId, postId, content) => {
  const [result] = await db.execute(
    'INSERT INTO notifications (user_id, type, actor_id, post_id, content) VALUES (?, ?, ?, ?, ?)',
    [userId, type, actorId, postId, content]
  );
  return result.insertId;
};

const getNotifications = async (userId, limit = 20) => {
  const [rows] = await db.execute(
    `SELECT n.*, a.username AS actor_username, a.avatar_url AS actor_avatar
     FROM notifications n
     LEFT JOIN users a ON n.actor_id = a.id
     WHERE n.user_id = ?
     ORDER BY n.created_at DESC
     LIMIT ?`,
    [userId, limit]
  );
  return rows;
};

const markAsRead = async (userId, notificationId) => {
  await db.execute(
    'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
    [notificationId, userId]
  );
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
};
