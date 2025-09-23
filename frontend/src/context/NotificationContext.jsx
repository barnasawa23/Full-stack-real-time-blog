import {  useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import axios from 'axios';
import { io } from 'socket.io-client';



export function NotificationProvider({ children }) {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const SOCKET_URL = 'http://localhost:5000';

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!token) return;
    const res = await axios.get('/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications(res.data);
  };

  useEffect(() => {
    fetchNotifications();
    if (!user) return;
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on(`notify_${user.id}`, notif => {
      setNotifications(n => [notif, ...n]);
    });
    return () => socket.disconnect();
    // eslint-disable-next-line
  }, [user, token]);

  const markAsRead = async id => {
    await axios.put(`/api/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications(n => n.map(notif => notif.id === id ? { ...notif, is_read: true } : notif));
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

