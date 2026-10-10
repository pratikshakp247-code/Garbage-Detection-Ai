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
import DonutChart from './DonutChart.jsx';
import MiniMap from './MiniMap.jsx';

export default function TrendChart() {
  return <div className="line-chart">
      <svg viewBox="0 0 700 220" preserveAspectRatio="none" aria-label="Detection trend chart">
        <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--green)" stopOpacity=".25" /><stop offset="100%" stopColor="var(--green)" stopOpacity="0" /></linearGradient></defs>
        <path className="chart-gridline" d="M0 40H700 M0 100H700 M0 160H700" />
        <path fill="url(#area)" d="M0 170 C60 165,90 125,140 138 S230 92,280 110 S360 58,420 82 S510 36,560 54 S640 30,700 22 V220 H0Z" />
        <path className="trend-line" d="M0 170 C60 165,90 125,140 138 S230 92,280 110 S360 58,420 82 S510 36,560 54 S640 30,700 22" />
      </svg>
      <div className="chart-labels"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span></div>
    </div>;
}
