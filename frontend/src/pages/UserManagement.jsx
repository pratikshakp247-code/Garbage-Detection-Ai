import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Bell, Bot, Calendar, Camera, Minus,
  Check, CheckCircle, RefreshCw, ChevronDown, CircleUserRound, Clock3, Cpu, Database,
  Download, Eye, EyeOff, FileBarChart, Filter, Focus, Globe, Key, Layers, LayoutDashboard,
  Leaf, LockKeyhole, LogOut, Mail, Map, MapPin, Menu, Monitor, Moon, Paperclip, Play, Plus,
  Printer, Recycle, Search, Server, Settings, ShieldCheck, Sliders, Smartphone, Sparkles,
  Square, Trash2, TrendingUp, TrendingDown, UploadCloud, Users, User, Video, Wifi, X, Zap,
  MoreVertical
} from "lucide-react";
import { navItems, detections } from "../data/constants.js";
import Brand from '../components/Brand.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import Card from '../components/Card.jsx';
import SectionHead from '../components/SectionHead.jsx';
import StatCard from '../components/StatCard.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import DetectionChart from '../components/DetectionChart.jsx';
import DonutChart from '../components/DonutChart.jsx';
import MiniMap from '../components/MiniMap.jsx';
import TrendChart from '../components/TrendChart.jsx';

export default function UserManagement({ navigate, embedded }) {
  const [users, setUsers] = useState([
    { id: 1, name: "Alex Morgan", email: "alex@greencity.gov", role: "Admin", status: "Active", lastActive: "Just now" },
    { id: 2, name: "Rajesh Kumar", email: "rajesh.k@greencity.gov", role: "Operator", status: "Active", lastActive: "2 hrs ago" },
    { id: 3, name: "Priya Sharma", email: "priya.s@greencity.gov", role: "Viewer", status: "Active", lastActive: "Yesterday" },
    { id: 4, name: "Anita Desai", email: "anita.d@greencity.gov", role: "Operator", status: "Inactive", lastActive: "1 week ago" },
    { id: 5, name: "Vikram Singh", email: "vikram.s@greencity.gov", role: "Operator", status: "Inactive", lastActive: "2 weeks ago" }
  ]);

  const toggleStatus = (id) => {
     setUsers(users.map(u => u.id === id ? {...u, status: u.status === "Active" ? "Inactive" : "Active"} : u));
  };

  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleAddUser = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const email = fd.get('email');
    const role = fd.get('role');
    setUsers([{ id: Date.now(), name, email, role, status: "Active", lastActive: "Never" }, ...users]);
    setIsAddingUser(false);
  };

  const header = (
    <div className={embedded ? "" : "welcome-row"} style={embedded ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } : {}}>
      <div>
        <div className={embedded ? "" : "welcome-title"} style={embedded ? { fontSize: '18px', fontWeight: 800 } : {}}>Users & Roles</div>
        <div className={embedded ? "" : "welcome-sub"} style={embedded ? { fontSize: '14px', color: 'var(--muted)', marginTop: '4px' } : {}}>Manage active users, roles, and system access.</div>
      </div>
      <Button onClick={() => setIsAddingUser(true)}><Plus size={16}/> Invite User</Button>
    </div>
  );

  const content = (
    <>
      {header}

      <Card>
        <div className="detection-list" style={{padding: "10px 20px"}}>
          <table style={{width: "100%", borderCollapse: "collapse", fontSize: '14px', textAlign: "left"}}>
            <thead>
              <tr style={{borderBottom: "1px solid var(--line)", color: "var(--muted)"}}>
                <th style={{padding: "12px 8px", fontWeight: 600}}>Name</th>
                <th style={{padding: "12px 8px", fontWeight: 600}}>Role</th>
                <th style={{padding: "12px 8px", fontWeight: 600}}>Status</th>
                <th style={{padding: "12px 8px", fontWeight: 600}}>Last Active</th>
                <th style={{padding: "12px 8px", fontWeight: 600, textAlign: "right"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{borderBottom: "1px solid var(--line)"}}>
                  <td style={{padding: "14px 8px"}}>
                    <div style={{fontWeight: 700, color: "var(--ink)", fontSize: "12px"}}>{user.name}</div>
                    <div style={{color: "var(--muted)", fontSize: '13px'}}>{user.email}</div>
                  </td>
                  <td style={{padding: "14px 8px"}}>
                    <span className="select-pill" style={{display: "inline-block", padding: "4px 8px"}}>{user.role}</span>
                  </td>
                  <td style={{padding: "14px 8px"}}>
                    <b style={{color: user.status === "Active" ? "var(--green)" : "var(--muted)"}}>{user.status}</b>
                  </td>
                  <td style={{padding: "14px 8px", color: "var(--muted)"}}>{user.lastActive}</td>
                  <td style={{padding: "14px 8px", textAlign: "right"}}>
                    <button className="text-button" style={{color: user.status === "Active" ? "var(--red)" : "var(--primary)"}} onClick={() => toggleStatus(user.id)}>
                      {user.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {isAddingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'var(--surface)', width: '100%', maxWidth: '420px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Invite New User</h3>
              <button onClick={() => setIsAddingUser(false)} style={{ background: 'var(--surface-2)', border: 'none', cursor: 'pointer', color: 'var(--muted)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='var(--line)'} onMouseLeave={(e) => e.currentTarget.style.background='var(--surface-2)'}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddUser} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px' }}>Full Name</label>
                  <input name="name" required placeholder="e.g. John Doe" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '14px', outline: 'none', background: 'var(--surface)', color: 'var(--ink)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px' }}>Email Address</label>
                  <input type="email" name="email" required placeholder="e.g. john@greencity.gov" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '14px', outline: 'none', background: 'var(--surface)', color: 'var(--ink)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px' }}>Role</label>
                  <select name="role" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '14px', outline: 'none', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer' }}>
                    <option value="Admin">Admin</option>
                    <option value="Operator">Operator</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <Button type="button" kind="secondary" style={{ flex: 1 }} onClick={() => setIsAddingUser(false)}>Cancel</Button>
                <Button type="submit" style={{ flex: 1 }}>Send Invitation</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{content}</div>;
  }

  return <div className="page-content">{content}</div>;
}
