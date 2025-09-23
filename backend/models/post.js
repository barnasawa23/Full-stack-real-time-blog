const db = require('../db');

const createPost = async (userId, content, image_url) => {
  const [result] = await db.execute(
    'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
    [userId, content, image_url]
  );
  return result.insertId;
};

const getPostById = async (id) => {
  const [rows] = await db.execute(
    'SELECT p.*, u.username, u.avatar_url FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
    [id]
  );
  return rows[0];
};

const getAllPosts = async () => {
  const [rows] = await db.execute(
    'SELECT p.*, u.username, u.avatar_url FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC'
  );
  return rows;
};

const getPostsByUser = async (userId) => {
  const [rows] = await db.execute(
    'SELECT p.*, u.username, u.avatar_url FROM posts p JOIN users u ON p.user_id = u.id WHERE p.user_id = ? ORDER BY p.created_at DESC',
    [userId]
  );
  return rows;
};

const updatePost = async (postId, userId, content, image_url) => {
  const [result] = await db.execute(
    'UPDATE posts SET content = ?, image_url = ?, updated_at = NOW() WHERE id = ? AND user_id = ?',
    [content, image_url, postId, userId]
  );
  return result.affectedRows > 0;
};

const deletePost = async (postId, userId) => {
  const [result] = await db.execute(
    'DELETE FROM posts WHERE id = ? AND user_id = ?',
    [postId, userId]
  );
  return result.affectedRows > 0;
};

module.exports = {
  createPost,
  getPostById,
  getAllPosts,
  getPostsByUser,
  updatePost,
  deletePost,
};
