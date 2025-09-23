const db = require('../db');

// Comments
const addComment = async (userId, postId, content) => {
  const [result] = await db.execute(
    'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)',
    [userId, postId, content]
  );
  return result.insertId;
};

const getComments = async (postId) => {
  const [rows] = await db.execute(
    'SELECT c.*, u.username, u.avatar_url FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC',
    [postId]
  );
  return rows;
};

// Likes
const likePost = async (userId, postId) => {
  await db.execute('INSERT IGNORE INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
};

const unlikePost = async (userId, postId) => {
  await db.execute('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
};

const getLikes = async (postId) => {
  const [rows] = await db.execute('SELECT user_id FROM likes WHERE post_id = ?', [postId]);
  return rows;
};

// Reposts
const repost = async (userId, postId) => {
  await db.execute('INSERT INTO reposts (user_id, post_id) VALUES (?, ?)', [userId, postId]);
};

const getReposts = async (postId) => {
  const [rows] = await db.execute('SELECT user_id FROM reposts WHERE post_id = ?', [postId]);
  return rows;
};

// Shares (for now, just a log)
const sharePost = async (userId, postId) => {
  // You can expand this to log shares or integrate with external APIs
  return { message: 'Post shared' };
};

module.exports = {
  addComment,
  getComments,
  likePost,
  unlikePost,
  getLikes,
  repost,
  getReposts,
  sharePost,
};
