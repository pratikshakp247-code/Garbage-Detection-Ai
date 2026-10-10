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
import TrendChart from './TrendChart.jsx';

export default function Brand({ compact = false }) {
  return <div className="brand">
      <div className="brand-mark"><Leaf size={compact ? 18 : 22} strokeWidth={2.6} /></div>
      {!compact && <div className="brand-name">GarbageDetect <span>AI</span></div>}
    </div>;
}
