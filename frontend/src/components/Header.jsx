import { useMemo, useState, useEffect, useRef } from "react";
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
import Brand from './Brand.jsx';
import Button from './Button.jsx';
import Field from './Field.jsx';
import Card from './Card.jsx';
import SectionHead from './SectionHead.jsx';
import StatCard from './StatCard.jsx';
import Sidebar from './Sidebar.jsx';
import DetectionChart from './DetectionChart.jsx';
import DonutChart from './DonutChart.jsx';
import MiniMap from './MiniMap.jsx';
import TrendChart from './TrendChart.jsx';
import { useNavigate, useLocation } from "react-router-dom";

export default function Header({ onMenu, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname === "/" 
    ? "Dashboard" 
    : location.pathname.substring(1).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace('And', '&');

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentUserName = localStorage.getItem('currentUser') || 'Alex Morgan';
  const currentUserEmail = localStorage.getItem('currentUserEmail') || 'alex@greencity.gov';
  const userInitials = currentUserName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.toLowerCase().trim();
    if (!q) return;

    if (q.includes("set")) navigate("/settings");
    else if (q.includes("dash")) navigate("/dashboard");
    else if (q.includes("map") || q.includes("loc")) navigate("/map");
    else if (q.includes("his") || q.includes("det")) navigate("/history");
    else if (q.includes("rep")) navigate("/reports");
    else if (q.includes("ana")) navigate("/analytics");
    else if (q.includes("not")) navigate("/notifications");
    else if (q.includes("cam") || q.includes("liv")) navigate("/live-camera");
    else if (q.includes("user")) navigate("/settings");
    else {
      alert(`No results found for "${searchQuery}".\n\nTry searching for pages like "Map", "History", "Settings", or "Analytics".`);
    }
    setSearchQuery("");
  };

  return <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button menu-button" onClick={onMenu}><Menu size={21} /></button>
        <div>
          <div className="page-name">{page}</div>
          <div className="page-date">{currentDate}</div>
        </div>
      </div>
      <div className="topbar-actions">
        <form className="search-box" onSubmit={handleSearch}>
          <Search size={17} />
          <input 
            aria-label="Search" 
            placeholder="Search anything..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <button className="icon-button notification-button" onClick={() => navigate("/notifications")}><Bell size={19} /><span /></button>
        <div ref={dropdownRef} style={{position: "relative"}}>
          <div onClick={() => setMenuOpen(!menuOpen)} style={{display: 'flex', alignItems: 'center', background: '#eef6ff', borderRadius: '24px', padding: '4px 8px 4px 4px', gap: '6px', cursor: 'pointer', border: '1px solid #dbeafe'}}>
            <div className="header-avatar" title={currentUserName} style={{width: '32px', height: '32px', fontSize: '13px'}}>{userInitials}</div>
            <ChevronDown size={15} color="var(--primary-dark)" />
          </div>
          {menuOpen && (
            <div className="avatar-dropdown" style={{position: "absolute", top: "100%", right: 0, marginTop: "8px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", padding: "8px", width: "200px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 100}}>
              <div style={{padding: "8px 12px", borderBottom: "1px solid var(--line)", marginBottom: "4px"}}>
                <b style={{display: "block", fontSize: "14px", color: "var(--ink)"}}>{currentUserName}</b>
                <span style={{fontSize: "12px", color: "var(--muted)", wordBreak: "break-all"}}>{currentUserEmail}</span>
              </div>
              <button className="dropdown-item" onClick={() => { navigate("/profile"); setMenuOpen(false); }}><User size={15} /> Profile</button>
              <button className="dropdown-item" onClick={() => { navigate("/settings"); setMenuOpen(false); }}><Settings size={15} /> Settings</button>
              <button className="dropdown-item" style={{color: "var(--red)"}} onClick={() => { onLogout(); setMenuOpen(false); }}><LogOut size={15} /> Log out</button>
            </div>
          )}
        </div>
      </div>
    </header>;
}
