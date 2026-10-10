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

export default function Login({ onLogin }) {
  const [signup, setSignup] = useState(false);
  const [visible, setVisible] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return <main className="login-shell">
      <div className="login-panel">
        <Brand />
        <div className="login-copy">
          <div className="eyebrow"><Sparkles size={14} /> AI-powered urban care</div>
          <div className="login-title">{signup ? "Register" : "Welcome back"}</div>
          <div className="login-subtitle">{signup ? "Register to join the cleaner, smarter city movement." : "Sign in to monitor a cleaner, smarter city."}</div>
        </div>
        <form className="login-form" onSubmit={(event) => {
          event.preventDefault();
          if (!email.trim() || !password.trim()) {
            alert("Please enter both email and password.");
            return;
          }
          
          const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
          
          if (signup) {
            if (!name.trim()) {
              alert("Please enter your name.");
              return;
            }
            if (users[email]) {
              alert("Email is already registered. Please switch to Sign in.");
              return;
            }
            users[email] = { password, name };
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', name);
            localStorage.setItem('currentUserEmail', email);
            onLogin();
          } else {
            if (!users[email]) {
              alert("Email not found. Please register first.");
              return;
            }
            if (users[email].password !== password) {
              alert("Incorrect password. Please try again.");
              return;
            }
            localStorage.setItem('currentUser', users[email].name);
            localStorage.setItem('currentUserEmail', email);
            onLogin();
          }
        }}>
          {signup && <Field icon={User} placeholder="Full name" value={name} onChange={setName} required />}
          <Field icon={Mail} placeholder="Work email" type="email" value={email} onChange={setEmail} required />
          <div className="password-wrap">
            <Field icon={LockKeyhole} placeholder="Password" type={visible ? "text" : "password"} value={password} onChange={setPassword} required />
            <button className="eye-button" type="button" aria-label="Toggle password visibility" onClick={() => setVisible(!visible)}>
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="form-meta">
            <label className="check-label"><input type="checkbox" /> <span>Remember me</span></label>
            {!signup && <button type="button" className="text-button">Forgot password?</button>}
          </div>
          <Button type="submit" className="full">{signup ? "Register" : "Sign in"} <ArrowRight size={17} /></Button>
          <div className="switch-auth">
            {signup ? "Already have an account?" : "New user?"}
            <button type="button" className="text-button" onClick={() => setSignup(!signup)}>{signup ? "Sign in" : "Register"}</button>
          </div>
        </form>
        <div className="login-footer"><ShieldCheck size={15} /> Protected with enterprise-grade security</div>
      </div>
      <div className="login-visual">
        <div className="visual-grid" />
        <div className="visual-orb orb-one" />
        <div className="visual-orb orb-two" />
        <div className="impact-card">
          <div className="impact-top">
            <div className="live-pill"><span /> Network live</div>
            <Activity size={20} />
          </div>
          <div className="impact-label">City impact this month</div>
          <div className="impact-value">18.4 tons</div>
          <div className="impact-detail">Waste identified before it reached waterways</div>
          <div className="impact-chart">
            {[35, 48, 42, 64, 58, 78, 92].map((height, i) => <span key={i} style={{ height: `${height}%` }} />)}
          </div>
        </div>
        <div className="floating-tag tag-one"><div className="tag-icon"><Recycle size={18} /></div><div><b>96.8%</b><span>Detection accuracy</span></div></div>
        <div className="floating-tag tag-two"><div className="tag-icon"><MapPin size={18} /></div><div><b>24 zones</b><span>Protected in real time</span></div></div>
        <div className="visual-message">See waste. Act faster.<br /><span>Build cleaner cities.</span></div>
      </div>
    </main>;
}
