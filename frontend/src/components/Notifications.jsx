import { useNotifications } from '../context/NotificationContext';

export default function Notifications() {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div style={{
      position:'fixed', top:60, right:20, width:320, background:'#fff',
      borderRadius:8, boxShadow:'0 2px 12px rgba(0,0,0,0.15)', padding:16, zIndex:1000
    }}>
      <h4 style={{margin:'0 0 12px 0', fontWeight:'bold'}}>Notifications</h4>
      {notifications.length === 0 && <div style={{color:'#888'}}>No notifications</div>}
      {notifications.map(n => (
        <div key={n.id} style={{
          marginBottom:12, padding:10, borderRadius:6,
          background: n.is_read ? '#f7f7f7' : '#e6f7ff',
          fontWeight: n.is_read ? 'normal' : 'bold',
          boxShadow: n.is_read ? 'none' : '0 1px 4px rgba(0,0,255,0.05)'
        }}>
          {n.content}
          {!n.is_read && (
            <button
              style={{
                marginLeft:12, background:'#007bff', color:'#fff',
                border:'none', borderRadius:4, padding:'2px 8px', cursor:'pointer'
              }}
              onClick={() => markAsRead(n.id)}
            >
              Mark as read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}