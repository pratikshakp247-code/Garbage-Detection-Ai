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
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import DetectionChart from './DetectionChart.jsx';
import DonutChart from './DonutChart.jsx';
import MiniMap from './MiniMap.jsx';
import TrendChart from './TrendChart.jsx';

export default function StatCard({ label, value, change, icon: Icon, tone, onClick, detail, options }) {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const isUp = change && (change.startsWith("+") || !change.startsWith("-"));
  return <Card className={`stat-card ${tone}`} onClick={onClick} style={{ ...(onClick ? {cursor: "pointer"} : {}), zIndex: menuOpen ? 20 : 1, display: "flex", alignItems: "flex-start", gap: "12px" }}>
      <div className={`stat-icon ${tone}`} style={{ flexShrink: 0 }}><Icon size={20} /></div>
      <div className="stat-copy" style={{ flex: 1, minWidth: 0, paddingRight: options ? "24px" : "0" }}>
        <div className="stat-label" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
        <div className="stat-value">{value}</div>
        
        {(detail || change) && (
          <div className="stat-detail" style={{ marginTop: "6px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", color: "var(--muted)", fontSize: '13px', lineHeight: 1.4 }}>
            {detail && <span style={{ display: "inline-block" }}>{detail}</span>}
            {change && !options && (
              <span className={`stat-change-inline ${isUp ? 'up' : 'down'}`} style={{ display: "flex", alignItems: "center", gap: "4px", color: isUp ? "var(--green)" : "var(--red)", fontWeight: 700, fontSize: "12px" }}>
                {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {change}
              </span>
            )}
          </div>
        )}
      </div>
      
      {options && (
        <div ref={dropdownRef} style={{ position: "absolute", top: "12px", right: "12px" }}>
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--muted)" }}
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
             <div style={{ position: "absolute", top: "100%", right: "0", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px", padding: "6px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 50, minWidth: "140px" }}>
               {options.map((opt, i) => (
                 <button 
                   key={i}
                   onClick={(e) => { e.stopPropagation(); setMenuOpen(false); opt.onClick?.(); }}
                   style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", textAlign: "left", padding: "8px 10px", fontSize: '13px', fontWeight: "600", background: "transparent", border: "none", cursor: "pointer", borderRadius: "5px", color: opt.danger ? "var(--red)" : "var(--muted)" }}
                   onMouseOver={(e) => e.currentTarget.style.background = "var(--surface-2)"}
                   onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                 >
                   {opt.label}
                 </button>
               ))}
             </div>
          )}
        </div>
      )}
    </Card>;
}
// HMR trigger
