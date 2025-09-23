import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export default function LikeButton({ postId }) {
  const { token, user } = useAuth();
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);

  const fetchLikes = async () => {
    const res = await axios.get(`/api/social/likes/${postId}`);
    setLikes(res.data);
    setLiked(res.data.some(l => l.user_id === user.id));
  };

  useEffect(() => {
    fetchLikes();
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on('new_like', data => {
      if (data.postId === postId) fetchLikes();
    });
    return () => socket.disconnect();
    // eslint-disable-next-line
  }, [postId, user.id]);

  const handleLike = async () => {
    await axios.post('/api/social/like', { postId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const handleUnlike = async () => {
    await axios.post('/api/social/unlike', { postId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  return (
    <span>
      <button onClick={liked ? handleUnlike : handleLike}>
        {liked ? 'Unlike' : 'Like'}
      </button>
      <span> {likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</span>
    </span>
  );
}