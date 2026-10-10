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

export default function Reports() {
  const [range, setRange] = useState("Weekly");

  const handleDownload = (type) => {
    let content, filename, mime;
    if (type === "pdf") {
      content = "Mock PDF Content for GarbageDetect Reports";
      filename = `GarbageDetect_Report_${range}.pdf`;
      mime = "application/pdf";
    } else {
      content = "ID,Date,Location,Type,Quantity,Status\nREP-1024,May 24 2025,Riverside Park,Plastic,15 kg,Assigned\nREP-1023,May 23 2025,Central District,Organic,42 kg,Cleaned\nREP-1022,May 22 2025,North River,Paper,8 kg,Pending";
      filename = `GarbageDetect_Report_${range}.csv`;
      mime = "text/csv";
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return <div className="page-content">
      <div className="welcome-row">
        <div><div className="welcome-title">Reports</div><div className="welcome-sub">Turn detection data into actionable city insights.</div></div>
        <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
          <Button onClick={() => handleDownload("pdf")}><Download size={17} /> Download PDF</Button>
          <Button kind="secondary" onClick={() => handleDownload("csv")}><Download size={17} /> Export CSV</Button>
          <Button kind="secondary" onClick={() => window.print()}><Printer size={17} /> Print Report</Button>
        </div>
      </div>
      <div className="range-tabs">{["Daily", "Weekly", "Monthly"].map((item) => <button className={range === item ? "active" : ""} onClick={() => setRange(item)} key={item}>{item}</button>)}</div>
      
      <div className="stats-grid report-stats">
        <StatCard label="Total detections" value="386" change="14.2%" icon={Focus} tone="green" />
        <StatCard label="Most detected" value="Plastic" change="38% share" icon={Recycle} tone="blue" />
        <StatCard label="Model accuracy" value="96.8%" change="1.4%" icon={Zap} tone="purple" />
        <StatCard label="Cleanup rate" value="84.5%" change="6.8%" icon={Check} tone="orange" />
      </div>

      <div className="reports-grid" style={{marginTop: "24px"}}>
        <Card className="span-two"><SectionHead title={`${range} performance`} detail="Detections and resolved cleanup tasks" /><DetectionChart timeRange={range === "Daily" ? "Today" : range === "Monthly" ? "This month" : "This week"} /></Card>
        <Card><SectionHead title="Report summary" detail="May 18 – May 24, 2025" /><div className="summary-list"><div><span>Peak detection day</span><b>Saturday</b></div><div><span>Busiest zone</span><b>Central District</b></div><div><span>Avg. response time</span><b>1h 42m</b></div><div><span>Waste diverted</span><b>1.8 tons</b></div></div><Button className="full" kind="secondary" onClick={() => handleDownload("pdf")}><FileBarChart size={17} /> Preview full report</Button></Card>

        <Card className="span-two">
          <SectionHead title="Garbage Category Breakdown" detail="Quantities and percentages" />
          <div className="detail-grid">
            <div><span>Plastic</span><b>476 (38%)</b><div style={{height: 4, background: "var(--blue)", width: "38%", marginTop: 4, borderRadius: 2}}/></div>
            <div><span>Organic</span><b>337 (27%)</b><div style={{height: 4, background: "var(--orange)", width: "27%", marginTop: 4, borderRadius: 2}}/></div>
            <div><span>Paper</span><b>225 (18%)</b><div style={{height: 4, background: "var(--purple)", width: "18%", marginTop: 4, borderRadius: 2}}/></div>
            <div><span>Glass</span><b>112 (9%)</b><div style={{height: 4, background: "var(--green)", width: "9%", marginTop: 4, borderRadius: 2}}/></div>
            <div><span>Metal</span><b>98 (8%)</b><div style={{height: 4, background: "var(--red)", width: "8%", marginTop: 4, borderRadius: 2}}/></div>
          </div>
        </Card>

        <Card>
          <SectionHead title="Location-wise Report" detail="Detections by area" />
          <div className="summary-list">
            <div><span>Central District</span><b>450</b></div>
            <div><span>Riverside Park</span><b>320</b></div>
            <div><span>North River</span><b>210</b></div>
            <div><span>Market Street</span><b>180</b></div>
            <div><span>South End</span><b>88</b></div>
          </div>
        </Card>

        <Card className="span-two">
          <SectionHead title="Detection vs Cleanup" detail="Task lifecycle" />
          <div className="detail-grid">
            <div><span>Detected</span><b>1,248</b></div>
            <div><span>Reported</span><b>1,100</b></div>
            <div><span>Assigned</span><b>950</b></div>
            <div><span>Cleaning in Progress</span><b style={{color: 'var(--blue)'}}>420</b></div>
            <div><span>Cleaned</span><b style={{color: 'var(--green)'}}>500</b></div>
            <div><span>Pending</span><b style={{color: 'var(--orange)'}}>150</b></div>
          </div>
        </Card>

        <Card>
          <SectionHead title="AI Detection Performance" detail="Model metrics" />
          <div className="summary-list">
            <div><span>Total detections</span><b>1,248</b></div>
            <div><span>Correct detections</span><b style={{color: 'var(--green)'}}>1,208</b></div>
            <div><span>False detections</span><b style={{color: 'var(--red)'}}>40</b></div>
            <div><span>Avg. confidence</span><b>93.2%</b></div>
            <div><span>Model accuracy</span><b>96.8%</b></div>
          </div>
        </Card>

        <Card>
          <SectionHead title="IoT Status" detail="Hardware network" />
          <div className="summary-list">
            <div><span>Connected cameras</span><b>24</b></div>
            <div><span>Online / Offline</span><b style={{display: 'flex', gap: 4}}><span style={{color: 'var(--green)'}}>23</span> / <span style={{color: 'var(--red)'}}>1</span></b></div>
            <div><span>Active sensors</span><b>48</b></div>
            <div><span>Sensor alerts</span><b style={{color: 'var(--orange)'}}>2</b></div>
          </div>
        </Card>

        <Card className="span-two" style={{gridColumn: "1 / -1"}}>
          <SectionHead title="Recent Reports" detail="Latest generated" />
          <div className="table-scroll">
            <table>
              <thead><tr><th>Report ID</th><th>Date</th><th>Location</th><th>Garbage Type</th><th>Quantity</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                <tr><td><b>REP-1024</b></td><td>May 24, 2025</td><td><span className="location-cell"><MapPin size={14}/> Riverside Park</span></td><td><span className="type-tag plastic">Plastic</span></td><td><b>15 kg</b></td><td><span className="status-tag assigned"><i/>Assigned</span></td><td><Button kind="secondary" onClick={() => handleDownload("pdf")}>View Details</Button></td></tr>
                <tr><td><b>REP-1023</b></td><td>May 23, 2025</td><td><span className="location-cell"><MapPin size={14}/> Central District</span></td><td><span className="type-tag organic">Organic</span></td><td><b>42 kg</b></td><td><span className="status-tag cleaned"><i/>Cleaned</span></td><td><Button kind="secondary" onClick={() => handleDownload("pdf")}>View Details</Button></td></tr>
                <tr><td><b>REP-1022</b></td><td>May 22, 2025</td><td><span className="location-cell"><MapPin size={14}/> North River</span></td><td><span className="type-tag paper">Paper</span></td><td><b>8 kg</b></td><td><span className="status-tag pending"><i/>Pending</span></td><td><Button kind="secondary" onClick={() => handleDownload("pdf")}>View Details</Button></td></tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>;
}
