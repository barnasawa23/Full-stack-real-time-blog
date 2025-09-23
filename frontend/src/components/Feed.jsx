import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { io } from 'socket.io-client';
import PostCreate from './PostCreate';

import Comments from './comments';
import LikeButton from './LikeButton';

const SOCKET_URL = 'http://localhost:5000'; // Change if your backend runs elsewhere

export default function Feed() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null);

  // Fetch posts
  const fetchPosts = async () => {
    const res = await axios.get('/api/posts/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
    // Set up Socket.IO connection
    const s = io(SOCKET_URL, { transports: ['websocket'] });
    setSocket(socket);

    // Listen for new posts
    s.on('new_post', data => {
      setPosts(posts => [data, ...posts]);
    });

    return () => s.disconnect();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <PostCreate onPostCreated={fetchPosts} />
      {posts.map(post => (
        <div key={post.id} style={{border: '1px solid #ccc', margin: 8, padding: 8}}>
          <div>
            <b>{post.username}</b> <span style={{color:'#888'}}>{new Date(post.created_at).toLocaleString()}</span>
          </div>
          <div>{post.content}</div>
          {post.image_url && (
            <img src={post.image_url} alt="post" style={{maxWidth: 300, marginTop: 8}} />
          )}
          <LikeButton postId={post.id} />
          <Comments postId={post.id} />
        </div>
      ))}
    </div>
  );
}