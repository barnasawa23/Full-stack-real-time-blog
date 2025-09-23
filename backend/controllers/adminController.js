
const adminModel = require('../models/admin');
const setActiveStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { active } = req.body;
    await adminModel.setActiveStatus(userId, active);
    res.json({ message: 'User active status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await adminModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await adminModel.deleteUser(userId);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const setAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const { is_admin } = req.body;
    await adminModel.setAdmin(userId, is_admin);
    res.json({ message: 'User admin status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await adminModel.getAllPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await adminModel.deletePost(postId);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  setAdmin,
  getAllPosts,
  deletePost,
  setActiveStatus,
};
