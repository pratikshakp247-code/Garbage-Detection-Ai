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

export default function LiveCamera() {
  const [running, setRunning] = useState(true);
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    setCaptured(true);
    const a = document.createElement("a");
    import('html2canvas').then(({ default: html2canvas }) => {
      const feedElement = document.querySelector('.camera-feed');
      if (feedElement) {
        html2canvas(feedElement, { useCORS: true, backgroundColor: null }).then(canvas => {
          a.href = canvas.toDataURL("image/png");
          a.download = `Capture_CAM-04_${Date.now()}.png`;
          a.click();
        });
      }
    });
    a.download = `Capture_CAM-04_${Date.now()}.png`;
    a.click();
    setTimeout(() => setCaptured(false), 2000);
  };

  return <div className="page-content">
      <div className="welcome-row"><div><div className="welcome-title">Live camera</div><div className="welcome-sub">Real-time monitoring and edge detection feed.</div></div><div className={running ? "status-pill" : "status-pill offline"}><span /> {running ? "Camera live" : "Camera paused"}</div></div>
      <div className="camera-grid">
        <Card className="camera-card">
          <div className="camera-feed">
            <div className="cam-sky" /><div className="cam-ground" /><div className="cam-tree tree-a" /><div className="cam-tree tree-b" />
            <div className="camera-overlay"><span>CAM-04 · Riverside Park</span><span><span className="rec-dot" /> {running ? "LIVE" : "PAUSED"} · 1080p</span></div>
            {running && <>
              <div className="detect-box live-box-a" style={{left: '38%', bottom: '18%', width: '90px', height: '80px', borderColor: 'var(--blue)'}}><span style={{background: 'var(--blue-dark)'}}>Plastic bottle · 96%</span></div>
              <div className="detect-box live-box-b" style={{right: '19%', bottom: '25%', width: '90px', height: '80px', borderColor: 'var(--purple)'}}><span style={{background: 'var(--purple-dark)'}}>Paper cup · 88%</span></div>
              <div className="detect-box live-box-c" style={{left: '20%', bottom: '15%', width: '60px', height: '30px', borderColor: 'var(--orange)'}}><span style={{background: 'var(--orange-dark)'}}>Banana peel · 92%</span></div>
              <div className="detect-box live-box-d" style={{right: '38%', bottom: '28%', width: '30px', height: '50px', borderColor: 'var(--green)'}}><span style={{background: 'var(--green-dark)'}}>Glass bottle · 79%</span></div>
            </>}
            <div className="camera-time">10:42:18 AM</div>
          </div>
          <div className="camera-controls">
            <div><Button kind={running ? "danger" : "primary"} onClick={() => setRunning(!running)}>{running ? <><Square size={15} /> Stop detection</> : <><Play size={15} /> Start detection</>}</Button><Button kind="secondary" onClick={handleCapture}>{captured ? <><Check size={17} /> Captured</> : <><Camera size={17} /> Capture frame</>}</Button></div>
            <div className="camera-select">CAM-04 <ChevronDown size={15} /></div>
          </div>
        </Card>
        <div className="camera-side">
          <Card><SectionHead title="Live stats" detail="Current camera session" /><div className="live-stat-grid"><div><Focus size={18} /><span>Detections</span><b>18</b></div><div><Zap size={18} /><span>Avg. confidence</span><b>93.2%</b></div><div><Clock3 size={18} /><span>Session</span><b>02:14:36</b></div><div><Activity size={18} /><span>Frame rate</span><b>29 FPS</b></div></div></Card>
          <Card><SectionHead title="Current detections" detail="Updated in real time" /><div className="result-items compact-results" style={{maxHeight: '230px', overflowY: 'auto'}}>
            <div className="result-item">
              <div className="result-number" style={{background: "var(--blue-soft)", color: "var(--blue)"}}><Recycle size={14}/></div>
              <div><b>Plastic bottle</b><span>Just now</span></div><strong>96%</strong>
            </div>
            <div className="result-item">
              <div className="result-number" style={{background: "var(--purple-soft)", color: "var(--purple)"}}><Paperclip size={14}/></div>
              <div><b>Paper cup</b><span>4 sec ago</span></div><strong>88%</strong>
            </div>
            <div className="result-item">
              <div className="result-number" style={{background: "var(--orange-soft)", color: "var(--orange)"}}><Leaf size={14}/></div>
              <div><b>Banana peel</b><span>12 sec ago</span></div><strong>92%</strong>
            </div>
            <div className="result-item">
              <div className="result-number" style={{background: "var(--green-soft)", color: "var(--green)"}}><Trash2 size={14}/></div>
              <div><b>Glass bottle</b><span>2 min ago</span></div><strong>79%</strong>
            </div>
          </div></Card>
        </div>
      </div>
    </div>;
}
