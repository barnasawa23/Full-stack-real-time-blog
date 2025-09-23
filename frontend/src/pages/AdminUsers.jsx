import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState('all'); // 'all', 'admin', 'user'
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data)).finally(() => setLoading(false));
  }, [token]);

  // Filtering logic
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesAdmin =
      adminFilter === 'all' ||
      (adminFilter === 'admin' && u.is_admin) ||
      (adminFilter === 'user' && !u.is_admin);
    const matchesActive =
      activeFilter === 'all' ||
      (activeFilter === 'active' && u.active) ||
      (activeFilter === 'inactive' && !u.active);
    return matchesSearch && matchesAdmin && matchesActive;
  });

  const handleToggleActive = async (id, currentActive) => {
    try {
      setLoading(true);
      await axios.put(`/api/admin/users/${id}/active`, { active: !currentActive }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh users
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      alert('Failed to update user activity', {error: err.response?.data?.message || err.message})
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <div style={{marginBottom:12}}>
        <input
          type="text"
          placeholder="Search by username or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{marginRight:8}}
        />
        <select value={adminFilter} onChange={e => setAdminFilter(e.target.value)} style={{marginRight:8}}>
          <option value="all">All</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
        <select value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      {loading && <div>Loading...</div>}
      <table>
        <thead>
          <tr><th>ID</th><th>Username</th><th>Email</th><th>Admin</th><th>Active</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.is_admin ? 'Yes' : 'No'}</td>
              <td>{u.active ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => handleToggleActive(u.id, u.active)} disabled={loading}>
                  {u.active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}