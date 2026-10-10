import { useMemo, useState, useEffect, useRef } from "react";
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Bell, Bot, Calendar, Camera, Minus,
  Check, CheckCircle, RefreshCw, ChevronDown, CircleUserRound, Clock3, Cpu, Database,
  Download, Eye, EyeOff, FileBarChart, Filter, Focus, Globe, Key, Layers, LayoutDashboard,
  Leaf, LockKeyhole, LogOut, Mail, Map, MapPin, Menu, Monitor, Moon, Paperclip, Play, Plus,
  Printer, Recycle, Search, Server, Settings, ShieldCheck, Sliders, Smartphone, Sparkles, Sun,
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

export default function Dashboard({ navigate }) {
    const [timeRange, setTimeRange] = useState("This week");
    const [chartMenuOpen, setChartMenuOpen] = useState(false);
    const timeRangeRef = useRef(null);

    useEffect(() => {
      function handleClickOutside(event) {
        if (timeRangeRef.current && !timeRangeRef.current.contains(event.target)) {
          setChartMenuOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const currentUser = localStorage.getItem('currentUser') || "Alex";

    return <div className="page-content">
        <div className="welcome-row">
          <div style={{display: 'flex', alignItems: 'center', gap: '14px'}}>
             <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)'}}>
                <Sun size={26} color="#F59E0B" />
             </div>
             <div>
                <div className="welcome-title">Good morning, {currentUser}</div>
                <div className="welcome-sub">Here's what your AI + IoT network found today.</div>
             </div>
          </div>
          <div style={{display: 'flex', gap: '8px', zIndex: 1}}>
             <Button kind="secondary" onClick={() => navigate("Reports")}><FileBarChart size={17} /> Generate report</Button>
             <Button onClick={() => navigate("Detection")}><Plus size={17} /> New detection</Button>
          </div>
        </div>
        
        <div className="stats-grid">
          <StatCard 
            label="Active users now" 
            value="12" 
            change="+2" 
            detail={<span style={{display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px'}}>vs yesterday <span style={{width: '3px', height: '3px', borderRadius: '50%', background: 'var(--muted-2)'}}></span> <b style={{color: 'var(--ink)'}}>3</b> Inactive</span>} 
            icon={Users} 
            tone="blue" 
            onClick={() => navigate("UserManagement")}
            options={[
              { label: "View User List", onClick: () => navigate("UserManagement") },
              { label: "Add New User", onClick: () => navigate("UserManagement") },
              { label: "Manage Roles", onClick: () => navigate("UserManagement") },
              { label: "Deactivate User...", danger: true, onClick: () => navigate("UserManagement") }
            ]}
          />
          <StatCard label="Total garbage" value="1,248" change="12.5%" detail="vs 1,109 last week" icon={Trash2} tone="purple" onClick={() => navigate("Analytics")} />
          <StatCard label="Plastic items" value="476" change="8.2%" detail="vs 440 last week" icon={Recycle} tone="green" onClick={() => navigate("History", "Plastic")} />
          <StatCard label="Organic waste" value="337 kg" change="5.7%" detail="vs 318 kg last week" icon={Leaf} tone="orange" onClick={() => navigate("History", "Organic")} />
          <StatCard label="Detection accuracy" value="96.8%" change="1.4%" detail="Consistent High Avg." icon={Zap} tone="red" onClick={() => navigate("Detection")} />
        </div>
        
        <div className="dashboard-grid">
          <Card className="span-two">
            <SectionHead 
              title={`${timeRange === 'Today' ? 'Hourly' : timeRange === 'This month' ? 'Monthly' : timeRange === 'This year' ? 'Yearly' : 'Weekly'} detections`}
              detail="Detected vs Cleaned items across all zones" 
              action={
                <div style={{display: 'flex', gap: '14px', alignItems: 'center'}}>
                  <div style={{display: 'flex', gap: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigate("History", "", "All statuses")}><span style={{width: '12px', height: '12px', borderRadius: '3px', background: '#3B82F6'}}></span> Detected</div>
                  <div style={{display: 'flex', gap: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigate("History", "", "Cleaned")}><span style={{width: '12px', height: '12px', borderRadius: '3px', background: '#6ee7b7'}}></span> Cleaned</div>
                  <div ref={timeRangeRef} style={{position: 'relative'}}>
                    <div className="select-pill" style={{cursor: 'pointer', fontSize: '14px', padding: '10px 12px'}} onClick={() => setChartMenuOpen(!chartMenuOpen)}>{timeRange} <ChevronDown size={14} /></div>
                    {chartMenuOpen && (
                      <div style={{ position: "absolute", top: "100%", right: "0", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px", padding: "6px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 50, minWidth: "120px", marginTop: "4px" }}>
                        {["Today", "This week", "This month", "This year"].map(opt => (
                           <button 
                             key={opt}
                             onClick={() => { setTimeRange(opt); setChartMenuOpen(false); }}
                             style={{ display: "block", width: "100%", textAlign: "left", padding: "10px", fontSize: '14px', fontWeight: "600", background: "transparent", border: "none", cursor: "pointer", borderRadius: "5px", color: "var(--muted)" }}
                             onMouseOver={(e) => e.currentTarget.style.background = "var(--surface-2)"}
                             onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                           >
                             {opt}
                           </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              } 
            />
            <DetectionChart range={timeRange} />
          </Card>
          
          <Card>
            <SectionHead title="Garbage categories" detail="Distribution this month" />
            <DonutChart compact />
          </Card>
          
          <Card className="span-two">
            <SectionHead title="Recent detections" detail="Latest AI-verified events" action={<button className="text-button" onClick={() => navigate("History")}>View all history <ArrowRight size={14} /></button>} />
            <div className="detection-list">
              {[
                 {type: "Plastic", location: "Riverside Park", confidence: "96%", time: "10:42 AM", status: "Detected", icon: Recycle},
                 {type: "Organic", location: "Market Street", confidence: "92%", time: "09:18 AM", status: "Cleaning", icon: Leaf},
                 {type: "Paper", location: "Central Station", confidence: "89%", time: "04:56 PM", status: "Cleaned", icon: Paperclip},
                 {type: "Glass", location: "Harbor Avenue", confidence: "94%", time: "01:06 PM", status: "Reported", icon: Trash2}
              ].map((item, i) => <div className="detection-row" key={i} style={{cursor: "pointer"}} onClick={() => navigate("History")}>
                <div className={`type-icon ${item.type.toLowerCase()}`}><item.icon size={17} /></div>
                <div className="detection-main">
                   <b>{item.type} waste</b>
                   <span><MapPin size={13} /> {item.location}</span>
                </div>
                <div className="detection-status" style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
                   <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
                <div className="detection-time">
                   <b>{item.confidence}</b>
                   <span>{item.time}</span>
                </div>
              </div>)}
            </div>
          </Card>
          
          <Card>
            <SectionHead title="Live location map" detail="Active IoT zones & hot-spots" action={<button className="text-button" onClick={() => navigate("Map")}>Expand</button>} />
            <div className="map-canvas" style={{height: '240px', margin: '0 20px 20px'}}>
              <div className="map-water" />
              <div className="map-road road-one" />
              <div className="map-road road-two" />
              <div className="map-road road-three" />
              <div className="marker" style={{ top: '40%', left: '20%' }}><Trash2 size={11} /></div>
              <div className="marker" style={{ top: '65%', left: '45%' }}><Camera size={11} /></div>
              <div className="marker warning" style={{ top: '30%', right: '35%' }}><Trash2 size={11} /></div>
              <div className="marker clean" style={{ top: '70%', right: '20%' }}><Check size={11} /></div>
              <div className="map-legend" style={{bottom: '10px', left: '10px'}}>
                 <span><i className="alert-dot" /> Hotspot</span>
                 <span><i className="warning-dot" /> Active</span>
                 <span><i className="clean-dot" /> Clean</span>
              </div>
            </div>
          </Card>
          
          <Card className="span-two">
            <SectionHead title="Recent login activity" detail="Latest user sessions" action={<button className="text-button" onClick={() => navigate("Login Activity")}>View all activity <ArrowRight size={14} /></button>} />
            <div className="activity-list">
              {[
                { name: "Alex Morgan", initials: "AM", role: "System Administrator", time: "Today, 10:42 AM", device: "Desktop", status: "Active" },
                { name: "Priya Sharma", initials: "PS", role: "Operator", time: "Today, 09:18 AM", device: "Mobile", status: "Active" },
                { name: "Rahul Patil", initials: "RP", role: "Supervisor", time: "Yesterday, 06:35 PM", device: "Desktop", status: "Logged out" }
              ].map((act, i) => (
                <div className="activity-row" key={i}>
                  <div className="activity-row-main">
                    <div className="avatar">{act.initials}</div>
                    <div className="activity-details">
                      <b>{act.name}</b>
                      <span>{act.role} • {act.device === "Mobile" ? <Smartphone size={10} style={{display:'inline', verticalAlign:'middle'}}/> : <Monitor size={10} style={{display:'inline', verticalAlign:'middle'}}/>} {act.device}</span>
                    </div>
                  </div>
                  <div className="activity-meta">
                    <span className={`status-indicator ${act.status === "Active" ? "active" : "offline"}`}>{act.status}</span>
                    <span style={{fontSize: '14px', color: 'var(--muted)', marginTop: '4px'}}>{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
             <SectionHead title="AI Detection Health" detail="System performance metrics" />
             <div className="health-grid">
               <div className="health-item">
                 <div className="h-icon"><Cpu size={16}/></div>
                 <div className="h-data"><span>Model Accuracy</span><b>98.4%</b></div>
               </div>
               <div className="health-item">
                 <div className="h-icon"><Focus size={16}/></div>
                 <div className="h-data"><span>Avg Confidence</span><b>92.1%</b></div>
               </div>
               <div className="health-item">
                 <div className="h-icon"><Database size={16}/></div>
                 <div className="h-data"><span>Total Detections</span><b>34,921</b></div>
               </div>
               <div className="health-item">
                 <div className="h-icon"><RefreshCw size={16}/></div>
                 <div className="h-data"><span>Last Update</span><b>2 hrs ago</b></div>
               </div>
             </div>
          </Card>
          
          <Card className="span-two">
             <SectionHead title="IoT Network Status" detail="Connected edge devices" />
             <div className="iot-grid">
               <div className="iot-card online">
                 <div className="iot-icon"><Server size={20}/></div>
                 <div className="iot-info"><span>Connected Nodes</span><b>124</b></div>
               </div>
               <div className="iot-card online">
                 <div className="iot-icon"><Camera size={20}/></div>
                 <div className="iot-info"><span>Active Cameras</span><b>89</b></div>
               </div>
               <div className="iot-card offline">
                 <div className="iot-icon"><AlertTriangle size={20}/></div>
                 <div className="iot-info"><span>Offline Cameras</span><b>3</b></div>
               </div>
               <div className="iot-card online">
                 <div className="iot-icon"><Activity size={20}/></div>
                 <div className="iot-info"><span>Active Sensors</span><b>32</b></div>
               </div>
             </div>
          </Card>
        </div>
      </div>;
}
