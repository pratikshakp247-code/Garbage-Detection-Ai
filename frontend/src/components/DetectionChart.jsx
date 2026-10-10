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
import DonutChart from './DonutChart.jsx';
import MiniMap from './MiniMap.jsx';
import TrendChart from './TrendChart.jsx';

export default function DetectionChart({ range }) {
  const datasets = {
    "Today": {
      data: [{ d: 15, c: 10 }, { d: 22, c: 20 }, { d: 18, c: 15 }, { d: 30, c: 25 }, { d: 25, c: 20 }, { d: 35, c: 30 }, { d: 20, c: 15 }],
      labels: ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"],
      max: 40
    },
    "This week": {
      data: [{ d: 45, c: 30 }, { d: 68, c: 60 }, { d: 54, c: 50 }, { d: 85, c: 75 }, { d: 72, c: 65 }, { d: 105, c: 95 }, { d: 90, c: 80 }],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      max: 120
    },
    "This month": {
      data: [{ d: 350, c: 300 }, { d: 420, c: 380 }, { d: 380, c: 350 }, { d: 510, c: 480 }, { d: 480, c: 450 }],
      labels: ["W1", "W2", "W3", "W4", "W5"],
      max: 600
    },
    "This year": {
      data: [{ d: 1200, c: 1100 }, { d: 1400, c: 1300 }, { d: 1150, c: 1000 }, { d: 1600, c: 1500 }, { d: 1800, c: 1700 }, { d: 1550, c: 1400 }],
      labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
      max: 2000
    }
  };

  const { data, labels, max } = datasets[range] || datasets["This week"];

  return <div className="chart-wrap">
      <div className="chart-y"><span>{max}</span><span>{Math.round(max * 0.66)}</span><span>{Math.round(max * 0.33)}</span><span>0</span></div>
      <div className="bar-chart double">
        {data.map((val, i) => <div className="bar-item" key={i}>
            <div className="bar-track double-track">
              <div className={`bar ${val.d > max * 0.8 ? "highlight" : ""}`} style={{ height: `${val.d / max * 100}%` }} />
              <div className="bar alt-bar" style={{ height: `${val.c / max * 100}%` }} />
            </div>
            <span>{labels[i]}</span>
          </div>)}
      </div>
    </div>;
}
