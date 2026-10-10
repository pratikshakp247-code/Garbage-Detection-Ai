import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Bell, Bot, Calendar, Camera, Minus,
  Check, CheckCircle, RefreshCw, ChevronDown, ChevronRight, CircleUserRound, Clock3, Cpu, Database,
  Download, Eye, EyeOff, FileBarChart, Filter, Focus, Globe, Key, Layers, LayoutDashboard,
  Leaf, LockKeyhole, LogOut, Mail, Map, MapPin, Menu, Monitor, Moon, Paperclip, Play, Plus,
  Printer, Recycle, Search, Server, Settings, ShieldCheck, Sliders, Smartphone, Sparkles,
  Square, Trash2, TrendingUp, TrendingDown, UploadCloud, Users, User, Video, Wifi, X, Zap,
  MoreVertical
} from "lucide-react";
import { navItems, detections } from "../data/constants.js";
import Brand from './Brand.jsx';
import Button from './Button.jsx';
import Field from './Field.jsx';
import Card from './Card.jsx';
import SectionHead from './SectionHead.jsx';
import StatCard from './StatCard.jsx';
import Header from './Header.jsx';
import DetectionChart from './DetectionChart.jsx';
import DonutChart from './DonutChart.jsx';
import MiniMap from './MiniMap.jsx';
import TrendChart from './TrendChart.jsx';
import { NavLink } from "react-router-dom";

export default function Sidebar({ open, onClose, onLogout }) {
  const currentUserName = localStorage.getItem('currentUser') || 'Alex Morgan';
  const userInitials = currentUserName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return <>
      {open && <button className="sidebar-overlay" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand"><Brand /><button className="mobile-close" onClick={onClose}><X size={20} /></button></div>
        <div className="nav-label">Workspace</div>
        <nav className="nav-list">
          {navItems.map(({ label, icon: Icon }) => {
            const path = `/${label.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`;
            return (
              <NavLink 
                key={label} 
                to={path}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                onClick={() => onClose()}
              >
                <Icon size={19} /><span>{label}</span>{(label === "Notifications" || label === "Alerts & Incidents") && <i>{label === "Notifications" ? 2 : 3}</i>}
              </NavLink>
            );
          })}
        </nav>
        <div className="eco-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'linear-gradient(135deg, #e6f6f4 0%, #f1f8f7 100%)', borderRadius: '12px', border: '1px solid #d1eae4', cursor: 'pointer', marginBottom: '16px' }}>
          <div style={{ display: 'grid', placeItems: 'center', width: '36px', height: '36px', background: '#c1efe1', borderRadius: '10px', color: '#065f46' }}><Leaf size={18} strokeWidth={2.5} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)' }}>City health score</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: '#059669', marginTop: '2px' }}><Leaf size={12} strokeWidth={3} /> Good</div>
          </div>
          <ChevronRight size={16} color="var(--muted)" />
        </div>
      </aside>
    </>;
}
