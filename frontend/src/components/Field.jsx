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
import Card from './Card.jsx';
import SectionHead from './SectionHead.jsx';
import StatCard from './StatCard.jsx';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import DetectionChart from './DetectionChart.jsx';
import DonutChart from './DonutChart.jsx';
import MiniMap from './MiniMap.jsx';
import TrendChart from './TrendChart.jsx';

export default function Field({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
  required
}) {
  return <div className="field">
      {Icon && <Icon size={18} />}
      <input aria-label={placeholder} type={type} placeholder={placeholder} value={value} onChange={(event) => onChange?.(event.target.value)} required={required} />
    </div>;
}
