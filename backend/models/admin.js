const db = require('../db');

const getAllUsers = async () => {
  const [rows] = await db.execute('SELECT id, username, email, is_admin, active, created_at FROM users');
  return rows;
};
const setActiveStatus = async (userId, active) => {
  await db.execute('UPDATE users SET active = ? WHERE id = ?', [active, userId]);
};

const deleteUser = async (userId) => {
  await db.execute('DELETE FROM users WHERE id = ?', [userId]);
};

const setAdmin = async (userId, isAdmin) => {
  await db.execute('UPDATE users SET is_admin = ? WHERE id = ?', [isAdmin, userId]);
};

const getAllPosts = async () => {
  const [rows] = await db.execute('SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC');
  return rows;
};

const deletePost = async (postId) => {
  await db.execute('DELETE FROM posts WHERE id = ?', [postId]);
};

module.exports = {
  getAllUsers,
  deleteUser,
  setAdmin,
  getAllPosts,
  deletePost,
  setActiveStatus,
};
