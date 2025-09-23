const db = require('../db');

const getUserProfile = async (userId) => {
  const [rows] = await db.execute('SELECT id, username, email, bio, avatar_url, created_at FROM users WHERE id = ?', [userId]);
  return rows[0];
};

const updateUserProfile = async (userId, bio, avatar_url) => {
  await db.execute('UPDATE users SET bio = ?, avatar_url = ? WHERE id = ?', [bio, avatar_url, userId]);
};

const followUser = async (followerId, followingId) => {
  await db.execute('INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)', [followerId, followingId]);
};

const unfollowUser = async (followerId, followingId) => {
  await db.execute('DELETE FROM follows WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
};

const getFollowers = async (userId) => {
  const [rows] = await db.execute('SELECT follower_id FROM follows WHERE following_id = ?', [userId]);
  return rows;
};

const getFollowing = async (userId) => {
  const [rows] = await db.execute('SELECT following_id FROM follows WHERE follower_id = ?', [userId]);
  return rows;
};

const searchUsers = async (query) => {
  const [rows] = await db.execute(
    'SELECT id, username, email, bio, avatar_url FROM users WHERE username LIKE ? OR email LIKE ? LIMIT 20',
    [`%${query}%`, `%${query}%`]
  );
  return rows;
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
};
