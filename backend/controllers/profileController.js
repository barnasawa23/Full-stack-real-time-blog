const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query required' });
    const users = await profileModel.searchUsers(q);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const profileModel = require('../models/profile');
const notificationModel = require('../models/notification');
const userModel = require('../models/user');

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const profile = await profileModel.getUserProfile(userId);
    if (!profile) return res.status(404).json({ message: 'User not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, avatar_url } = req.body;
    await profileModel.updateUserProfile(userId, bio, avatar_url);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const follow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;
    if (followerId == followingId) return res.status(400).json({ message: 'Cannot follow yourself' });
    await profileModel.followUser(followerId, followingId);

    // Notification logic
    const actor = await userModel.findUserById(followerId);
    const notifContent = `${actor.username} started following you`;
    const notifId = await notificationModel.createNotification(
      followingId, // recipient
      'follow',
      followerId,  // actor
      null,
      notifContent
    );
    // Emit real-time notification to recipient
    const io = req.app.get('io');
    io.emit(`notify_${followingId}`, {
      id: notifId,
      type: 'follow',
      actor_id: followerId,
      post_id: null,
      content: notifContent
    });

    res.json({ message: 'Followed user' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const unfollow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;
    await profileModel.unfollowUser(followerId, followingId);
    res.json({ message: 'Unfollowed user' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;
    const followers = await profileModel.getFollowers(userId);
    res.json(followers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;
    const following = await profileModel.getFollowing(userId);
    res.json(following);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  searchUsers,
};
