import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

export default function PostCreate({ onPostCreated }) {
  const { token } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);

      const res = await axios.post('/api/posts/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setContent('');
      setImage(null);
      if (onPostCreated) onPostCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{marginBottom: 24}}>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's on your mind?"
        required
        rows={3}
        style={{width: '100%'}}
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setImage(e.target.files[0])}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}