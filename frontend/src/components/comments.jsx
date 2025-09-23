import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Adjust if needed

export default function Comments({ postId }) {
  const { token } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const fetchComments = async () => {
    const res = await axios.get(`/api/social/comments/${postId}`);
    setComments(res.data);
  };

  useEffect(() => {
    fetchComments();
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on('new_comment', data => {
      if (data.postId === postId) fetchComments();
    });
    return () => socket.disconnect();
    // eslint-disable-next-line
  }, [postId]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/social/comment', { postId, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent('');
      // fetchComments(); // Not needed, real-time will update
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to comment');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button type="submit">Comment</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
      <div>
        {comments.map(c => (
          <div key={c.id} style={{marginTop: 4}}>
            <b>{c.username}</b>: {c.content}
          </div>
        ))}
      </div>
    </div>
  );
}