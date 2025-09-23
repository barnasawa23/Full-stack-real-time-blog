import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/userAuth';

export default function AdminPosts() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/posts', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setPosts(res.data));
  }, [token]);

  const deletePost = id => {
    axios.delete(`/api/admin/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => setPosts(posts.filter(p => p.id !== id)));
  };

  return (
    <div>
      <h2>Manage Posts</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>User</th><th>Content</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.username}</td>
              <td>{p.content}</td>
              <td>
                <button onClick={() => deletePost(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}