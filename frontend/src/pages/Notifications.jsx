import { useState } from "react";
import {
  AlertTriangle, CheckCircle, Wifi, FileBarChart, Cpu, X, Check, Trash2, Settings, ArrowRight, Bell
} from "lucide-react";
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';

const initialNotifications = [
  {
    id: 1,
    title: "High garbage accumulation detected",
    message: "Camera 04 (City Center) has detected a high volume of mixed waste. Dispatch recommended.",
    time: "10 mins ago",
    type: "danger",
    category: "Alerts",
    icon: <AlertTriangle size={22} />,
    unread: true,
    action: "View on map"
  },
  {
    id: 2,
    title: "Zone B Cleanup Completed",
    message: "Municipal workers have successfully cleared the waste near River Park.",
    time: "2 hours ago",
    type: "green",
    category: "System",
    icon: <CheckCircle size={22} />,
    unread: true,
    action: "View details"
  },
  {
    id: 3,
    title: "Camera 12 Offline",
    message: "Connection lost with Camera 12 at North Avenue. IoT team notified.",
    time: "5 hours ago",
    type: "orange",
    category: "Alerts",
    icon: <Wifi size={22} />,
    unread: false,
    action: "Check status"
  },
  {
    id: 4,
    title: "Weekly Analytics Report",
    message: "Your weekly garbage detection and cleaning report is ready to view.",
    time: "1 day ago",
    type: "purple",
    category: "System",
    icon: <FileBarChart size={22} />,
    unread: false,
    action: "Download report"
  },
  {
    id: 5,
    title: "AI Model Updated",
    message: "The garbage detection model has been updated (v2.4) for better accuracy in low light conditions.",
    time: "2 days ago",
    type: "",
    category: "System",
    icon: <Cpu size={22} />,
    unread: false,
    action: "Release notes"
  }
];

export default function Notifications({ navigate }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("All");

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    if(confirm("Are you sure you want to delete all notifications?")) {
      setNotifications([]);
    }
  };

  const handleAction = (action) => {
    if (action === "View on map") {
      navigate("Map");
    } else if (action === "View details") {
      navigate("History");
    } else if (action === "Check status") {
      navigate("Live Camera");
    } else if (action === "Download report") {
      navigate("Reports");
    } else {
      alert(`Executing action: ${action}`);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return n.unread;
    return n.category === activeFilter;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="page-content notifications-page">
      <div className="welcome-row">
        <div>
          <div className="welcome-title">Notifications</div>
          <div className="welcome-sub">Alerts and updates from the system.</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {unreadCount > 0 && (
             <Button kind="secondary" onClick={markAllAsRead}>
               <Check size={14} /> Mark all as read
             </Button>
          )}
          {notifications.length > 0 && (
             <Button kind="secondary" onClick={clearAll} style={{ color: 'var(--red)' }}>
               <Trash2 size={14} /> Clear all
             </Button>
          )}
          <Button kind="secondary" onClick={() => alert("Notification preferences")}>
             <Settings size={14} /> Settings
          </Button>
        </div>
      </div>
      
      <div className="range-tabs" style={{ marginBottom: '20px' }}>
        {["All", "Unread", "Alerts", "System"].map(filter => (
          <button 
            key={filter} 
            className={activeFilter === filter ? 'active' : ''}
            onClick={() => setActiveFilter(filter)}
          >
            {filter} {filter === 'Unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
          </button>
        ))}
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {filteredNotifications.length === 0 ? (
          <div className="empty-state" style={{ minHeight: '350px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', marginBottom: '16px', color: 'var(--muted)' }}>
                <Bell size={28} />
            </div>
            <b>No {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} notifications</b>
            <span>You're all caught up! There's nothing new here right now.</span>
          </div>
        ) : (
          <div className="notification-list">
            {filteredNotifications.map((note) => (
              <div key={note.id} className={`notice ${note.unread ? 'unread' : ''}`}>
                <div className={`notice-icon ${note.type}`}>
                  {note.icon}
                </div>
                <div className="notice-copy">
                  <div>
                    <b>{note.title}</b>
                    {note.unread && <i></i>}
                  </div>
                  <span>{note.message}</span>
                  
                  {note.action && (
                    <div style={{ marginTop: '10px' }}>
                      <button className="text-button" onClick={() => handleAction(note.action)}>
                        {note.action} <ArrowRight size={10} />
                      </button>
                    </div>
                  )}
                  
                  <small>{note.time}</small>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {note.unread && (
                    <button className="more-button" title="Mark as read" onClick={() => markAsRead(note.id)}>
                      <Check size={18} />
                    </button>
                  )}
                  <button className="more-button" title="Delete notification" onClick={() => deleteNotification(note.id)}>
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
