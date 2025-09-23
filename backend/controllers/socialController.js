
const socialModel = require('../models/social');
const notificationModel = require('../models/notification');
const postModel = require('../models/post');
const userModel = require('../models/user');

// Comments
const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId, content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });
    const commentId = await socialModel.addComment(userId, postId, content);
    // Emit real-time event for new comment
    const io = req.app.get('io');
    io.emit('new_comment', { commentId, userId, postId, content });

    // Notification logic
    const post = await postModel.getPostById(postId);
    if (post && post.user_id !== userId) {
      const actor = await userModel.findUserById(userId);
      const notifContent = `${actor.username} commented on your post`;
      const notifId = await notificationModel.createNotification(
        post.user_id, // recipient
        'comment',
        userId,       // actor
        postId,
        notifContent
      );
      // Emit real-time notification to recipient
      io.emit(`notify_${post.user_id}`, {
        id: notifId,
        type: 'comment',
        actor_id: userId,
        post_id: postId,
        content: notifContent
      });
    }

    res.status(201).json({ message: 'Comment added', commentId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await socialModel.getComments(postId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Likes
const likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;
    await socialModel.likePost(userId, postId);
    // Emit real-time event for like
    const io = req.app.get('io');
    io.emit('new_like', { userId, postId });

    // Notification logic
    const post = await postModel.getPostById(postId);
    if (post && post.user_id !== userId) {
      const actor = await userModel.findUserById(userId);
      const notifContent = `${actor.username} liked your post`;
      const notifId = await notificationModel.createNotification(
        post.user_id, // recipient
        'like',
        userId,       // actor
        postId,
        notifContent
      );
      // Emit real-time notification to recipient
      io.emit(`notify_${post.user_id}`, {
        id: notifId,
        type: 'like',
        actor_id: userId,
        post_id: postId,
        content: notifContent
      });
    }

    res.json({ message: 'Post liked' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const unlikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;
    await socialModel.unlikePost(userId, postId);
    res.json({ message: 'Post unliked' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await socialModel.getLikes(postId);
    res.json(likes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reposts
const repost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;
    await socialModel.repost(userId, postId);
    // Emit real-time event for repost
    const io = req.app.get('io');
    io.emit('new_repost', { userId, postId });

    // Notification logic
    const post = await postModel.getPostById(postId);
    if (post && post.user_id !== userId) {
      const actor = await userModel.findUserById(userId);
      const notifContent = `${actor.username} reposted your post`;
      const notifId = await notificationModel.createNotification(
        post.user_id, // recipient
        'repost',
        userId,       // actor
        postId,
        notifContent
      );
      // Emit real-time notification to recipient
      io.emit(`notify_${post.user_id}`, {
        id: notifId,
        type: 'repost',
        actor_id: userId,
        post_id: postId,
        content: notifContent
      });
    }

    res.json({ message: 'Post reposted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getReposts = async (req, res) => {
  try {
    const { postId } = req.params;
    const reposts = await socialModel.getReposts(postId);
    res.json(reposts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Shares
const sharePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;
  const result = await socialModel.sharePost(userId, postId);
  // Emit real-time event for share
  const io = req.app.get('io');
  io.emit('new_share', { userId, postId });
  res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
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
