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

export default function Detection() {
  const [uploaded, setUploaded] = useState(null);
  const [detected, setDetected] = useState(false);
  const [hoveredBox, setHoveredBox] = useState(null);
  const [assigned, setAssigned] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploaded(URL.createObjectURL(e.target.files[0]));
      setDetected(false);
    }
  };

  const removeImage = () => {
    setUploaded(null);
    setDetected(false);
  };

  return <div className="page-content">
      <div className="welcome-row"><div><div className="welcome-title">Garbage detection</div><div className="welcome-sub">Upload a street image or connect a camera for instant AI analysis.</div></div><div className="status-pill"><span /> AI model online</div></div>
      <div className="detection-layout">
        <Card className="upload-card">
          <SectionHead title="Image input" detail="JPG, PNG or WEBP · maximum 15 MB" />
          {!uploaded ? <label className="dropzone">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div className="upload-icon"><UploadCloud size={27} /></div>
              <b>Drop an image here</b><span>or click to browse from your device</span>
              <div className="upload-types"><span>JPG</span><span>PNG</span><span>WEBP</span></div>
            </label> : <div className="sample-photo" style={typeof uploaded === "string" ? {backgroundImage: `url(${uploaded})`, backgroundSize: 'cover', backgroundPosition: 'center'} : {}}>
              {typeof uploaded !== "string" && <><div className="photo-sky" /><div className="photo-building building-one" /><div className="photo-building building-two" /><div className="photo-road" />
              <div className="trash-shape bottle" /><div className="trash-shape bag" /><div className="trash-shape cup" /><div className="trash-shape peel" /><div className="trash-shape glass" /></>}
              {detected && <>
                <div className={`detect-box box-one ${hoveredBox===1 ? 'active' : ''}`} style={Object.assign({opacity: hoveredBox && hoveredBox!==1 ? 0.3 : 1}, typeof uploaded === "string" ? {top: '40%', left: '30%'} : {})}><span>Plastic bottle · 94%</span></div>
                <div className={`detect-box box-two ${hoveredBox===2 ? 'active' : ''}`} style={Object.assign({opacity: hoveredBox && hoveredBox!==2 ? 0.3 : 1}, typeof uploaded === "string" ? {top: '60%', left: '60%'} : {})}><span>Plastic bag · 89%</span></div>
                <div className={`detect-box box-three ${hoveredBox===3 ? 'active' : ''}`} style={Object.assign({opacity: hoveredBox && hoveredBox!==3 ? 0.3 : 1}, typeof uploaded === "string" ? {top: '50%', left: '45%'} : {})}><span>Paper cup · 91%</span></div>
                <div className={`detect-box box-four ${hoveredBox===4 ? 'active' : ''}`} style={Object.assign({opacity: hoveredBox && hoveredBox!==4 ? 0.3 : 1}, typeof uploaded === "string" ? {top: '70%', left: '20%'} : {})}><span>Banana peel · 96%</span></div>
                <div className={`detect-box box-five ${hoveredBox===5 ? 'active' : ''}`} style={Object.assign({opacity: hoveredBox && hoveredBox!==5 ? 0.3 : 1}, typeof uploaded === "string" ? {top: '65%', left: '80%'} : {})}><span>Glass bottle · 85%</span></div>
              </>}
              <button className="remove-image" onClick={removeImage}><X size={17} /></button>
              <div className="image-meta">Uploaded image <span>Ready</span></div>
            </div>}
          <div className="upload-actions">
            <Button kind="secondary" onClick={() => { setUploaded(true); setDetected(false); }}><Camera size={17} /> Load demo image</Button>
            <Button onClick={() => setDetected(true)} disabled={!uploaded}><Sparkles size={17} /> Detect garbage</Button>
          </div>
        </Card>
        <Card className="results-card">
          <SectionHead title="Detection results" detail={detected ? "5 objects identified in 1.12 seconds" : "Results will appear here"} action={detected ? <div className="success-icon"><Check size={15} /></div> : null} />
          {detected ? <>
              <div className="result-score">
                <div className="score-ring" style={{background: 'radial-gradient(circle, var(--surface) 59%, transparent 61%), conic-gradient(var(--blue) 0 40%, var(--purple) 40% 60%, var(--orange) 60% 80%, var(--green) 80% 100%)'}}>
                  <b>5</b><span>Objects found</span>
                </div>
              </div>
              <div className="result-items" style={{maxHeight: "180px", overflowY: "auto"}}>
                <div className="result-item" style={{cursor: "pointer", background: hoveredBox === 1 ? "var(--surface-2)" : "transparent"}} onMouseEnter={() => setHoveredBox(1)} onMouseLeave={() => setHoveredBox(null)}>
                  <div className="result-number" style={{background: "var(--blue-soft)", color: "var(--blue)"}}><Recycle size={14}/></div>
                  <div><b>Plastic bottle</b><span>Recyclable plastic · PET</span></div><strong>94%</strong>
                </div>
                <div className="result-item" style={{cursor: "pointer", background: hoveredBox === 2 ? "var(--surface-2)" : "transparent"}} onMouseEnter={() => setHoveredBox(2)} onMouseLeave={() => setHoveredBox(null)}>
                  <div className="result-number" style={{background: "var(--blue-soft)", color: "var(--blue)"}}><Recycle size={14}/></div>
                  <div><b>Plastic bag</b><span>Soft plastic · LDPE</span></div><strong>89%</strong>
                </div>
                <div className="result-item" style={{cursor: "pointer", background: hoveredBox === 3 ? "var(--surface-2)" : "transparent"}} onMouseEnter={() => setHoveredBox(3)} onMouseLeave={() => setHoveredBox(null)}>
                  <div className="result-number" style={{background: "var(--purple-soft)", color: "var(--purple)"}}><Paperclip size={14}/></div>
                  <div><b>Paper cup</b><span>Paper waste · Coated</span></div><strong>91%</strong>
                </div>
                <div className="result-item" style={{cursor: "pointer", background: hoveredBox === 4 ? "var(--surface-2)" : "transparent"}} onMouseEnter={() => setHoveredBox(4)} onMouseLeave={() => setHoveredBox(null)}>
                  <div className="result-number" style={{background: "var(--orange-soft)", color: "var(--orange)"}}><Leaf size={14}/></div>
                  <div><b>Banana peel</b><span>Organic waste · Compostable</span></div><strong>96%</strong>
                </div>
                <div className="result-item" style={{cursor: "pointer", background: hoveredBox === 5 ? "var(--surface-2)" : "transparent"}} onMouseEnter={() => setHoveredBox(5)} onMouseLeave={() => setHoveredBox(null)}>
                  <div className="result-number" style={{background: "var(--green-soft)", color: "var(--green)"}}><Trash2 size={14}/></div>
                  <div><b>Glass bottle</b><span>Glass waste · Recyclable</span></div><strong>85%</strong>
                </div>
              </div>
              <div className="detail-grid"><div><span>Quantity</span><b>5 items</b></div><div><span>Est. weight</span><b>1.25 kg</b></div><div><span>Categories</span><div style={{display: 'flex', gap: '4px', marginTop: '4px'}}><span style={{width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)'}}></span><span style={{width: 8, height: 8, borderRadius: '50%', background: 'var(--purple)'}}></span><span style={{width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)'}}></span><span style={{width: 8, height: 8, borderRadius: '50%', background: 'var(--green)'}}></span></div></div><div><span>Priority</span><b className="priority" style={{color:"var(--red)"}}>High</b></div></div>
              <Button className="full" kind={assigned ? "secondary" : "primary"} onClick={() => setAssigned(true)}>
                {assigned ? <><Check size={17} /> Task Assigned Successfully</> : <><MapPin size={17} /> Assign cleanup task</>}
              </Button>
            </> : <div className="empty-state"><Focus size={35} /><b>No detection yet</b><span>Upload an image and run the AI model to see detailed results.</span></div>}
        </Card>
      </div>
    </div>;
}
