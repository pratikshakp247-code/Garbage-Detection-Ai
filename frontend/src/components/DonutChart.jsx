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
import Brand from './Brand.jsx';
import Button from './Button.jsx';
import Field from './Field.jsx';
import Card from './Card.jsx';
import SectionHead from './SectionHead.jsx';
import StatCard from './StatCard.jsx';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import DetectionChart from './DetectionChart.jsx';
import MiniMap from './MiniMap.jsx';
import TrendChart from './TrendChart.jsx';

export default function DonutChart({ compact = false }) {
  const [showAll, setShowAll] = useState(false);
  const total = 1248;
  const categories = [
    { name: "Plastic Waste", desc: "bottles, bags, wrappers", count: 476, color: "#3B82F6" },
    { name: "Organic Waste", desc: "food waste, leaves, vegetable waste", count: 337, color: "#10B981" },
    { name: "Paper & Cardboard", desc: "paper, newspapers, boxes", count: 160, color: "#F59E0B" },
    { name: "Glass", desc: "bottles, glass containers", count: 90, color: "#60A5FA" },
    { name: "Metal", desc: "cans, metal scraps", count: 55, color: "#8B5CF6" },
    { name: "Medical Waste", desc: "masks, gloves, medical materials", count: 40, color: "#EF4444" },
    { name: "Textile Waste", desc: "clothes, fabric", count: 30, color: "#EC4899" },
    { name: "E-Waste", desc: "wires, electronics, batteries", count: 25, color: "#06B6D4" },
    { name: "Hazardous Waste", desc: "chemicals, paints, etc.", count: 20, color: "#F97316" },
    { name: "Mixed / Black Bag Waste", desc: "mixed household waste that cannot be easily separated", count: 15, color: "#64748B" },
  ];

  let currentPercent = 0;
  const top5 = categories.slice(0, 5);
  const otherSum = categories.slice(5).reduce((acc, cat) => acc + cat.count, 0);
  
  const chartSlices = [...top5, { name: "Other", count: otherSum, color: "var(--line)" }];
  
  let cumulativePercent = 0;
  const svgSlices = chartSlices.map(slice => {
    const percent = slice.count / total;
    if (percent === 0) return { ...slice, path: "", percent };
    
    if (percent >= 1) {
      return { ...slice, path: "M 1 0 A 1 1 0 1 1 -1 0 A 1 1 0 1 1 1 0 Z", percent };
    }

    const startX = Math.cos(2 * Math.PI * (cumulativePercent - 0.25));
    const startY = Math.sin(2 * Math.PI * (cumulativePercent - 0.25));
    cumulativePercent += percent;
    const endX = Math.cos(2 * Math.PI * (cumulativePercent - 0.25));
    const endY = Math.sin(2 * Math.PI * (cumulativePercent - 0.25));
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    const path = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
    
    return { ...slice, path, percent };
  });

  const displayList = showAll ? categories : top5;

  return <div className={`donut-wrap ${compact ? "compact" : ""}`}>
      <div className="donut" style={{ background: 'transparent', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <svg viewBox="-1 -1 2 2" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '50%' }}>
          {svgSlices.map((slice, i) => (
            <path 
              key={slice.name} 
              d={slice.path} 
              fill={slice.color} 
              style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} 
              onMouseEnter={(e) => e.target.style.opacity = 0.8} 
              onMouseLeave={(e) => e.target.style.opacity = 1}
            >
              <title>{`${slice.name}: ${slice.count} (${(slice.percent * 100).toFixed(1)}%)`}</title>
            </path>
          ))}
        </svg>
        <div style={{ position: 'relative', zIndex: 10 }}><b>{total.toLocaleString()}</b><span>Total</span></div>
      </div>
      <div className="legend">
        {displayList.map(cat => {
          const percent = ((cat.count / total) * 100).toFixed(1);
          return <div className="legend-row" key={cat.name} style={{ alignItems: "flex-start" }}>
            <span className="legend-dot" style={{ background: cat.color, marginTop: "3px" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
               <span style={{ fontSize: '14px', fontWeight: "600", color: "var(--ink)" }}>{cat.name}</span>
               <span style={{ fontSize: '13px', color: "var(--muted-2)", marginTop: "2px", maxWidth: "200px", lineHeight: 1.3 }}>{cat.desc}</span>
            </div>
            <div style={{marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center"}}>
               <span style={{color: "var(--muted)", fontSize: '14px'}}>{cat.count}</span>
               <b>{percent}%</b>
            </div>
          </div>
        })}
        {!showAll ? (
          <button className="text-button" onClick={() => setShowAll(true)} style={{ marginTop: "6px", alignSelf: "flex-start", fontSize: '14px' }}>View all categories <ArrowRight size={14} /></button>
        ) : (
          <button className="text-button" onClick={() => setShowAll(false)} style={{ marginTop: "6px", alignSelf: "flex-start", fontSize: '14px' }}>Show less</button>
        )}
      </div>
    </div>;
}
