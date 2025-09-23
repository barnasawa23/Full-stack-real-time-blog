const postModel = require('../models/post');

const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    if (!content) return res.status(400).json({ message: 'Content is required' });
  const postId = await postModel.createPost(userId, content, image_url);
  // Emit real-time event for new post
  const io = req.app.get('io');
  io.emit('new_post', { postId, userId, content, image_url });
  res.status(201).json({ message: 'Post created', postId, image_url });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await postModel.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.getAllPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await postModel.getPostsByUser(req.params.userId);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { content, image_url } = req.body;
    const updated = await postModel.updatePost(postId, userId, content, image_url || null);
    if (!updated) return res.status(403).json({ message: 'Not authorized or post not found' });
    res.json({ message: 'Post updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const deleted = await postModel.deletePost(postId, userId);
    if (!deleted) return res.status(403).json({ message: 'Not authorized or post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createPost,
  getPost,
  getAllPosts,
  getUserPosts,
  updatePost,
  deletePost,
};
