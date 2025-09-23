import { useNotifications } from '../context/useNotifications';

import { useState } from 'react';
import Notifications from './Notifications';

export default function Header() {
  const { notifications } = useNotifications();
  const [showNotif, setShowNotif] = useState(false);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 20px', background:'#222', color:'#fff'}}>
      <h2>Realtime Blog</h2>
      <div style={{position:'relative'}}>
        <span style={{fontSize:24, cursor:'pointer'}}>🔔</span>
        {unreadCount > 0 && (
          <span style={{
            position:'absolute', top:-8, right:-8, background:'red', color:'#fff',
            borderRadius:'50%', padding:'2px 6px', fontSize:12, fontWeight:'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </div>
      <span style={{fontSize:24, cursor:'pointer'}} onClick={() => setShowNotif(s => !s)}>🔔</span>
      {showNotif && <Notifications />}
    </header>
  );
}