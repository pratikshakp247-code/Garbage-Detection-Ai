import { useState } from "react";
import {
  AlertTriangle, ChevronDown, Clock3, Database, Download, Globe, Key, Map, Monitor, Moon, Server, ShieldCheck, Check, FileBarChart, RefreshCw, Settings, Users, Wrench
} from "lucide-react";
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import SectionHead from '../components/SectionHead.jsx';
import UserManagement from './UserManagement.jsx';


export default function SettingsPage({ dark, onDark, onLogout }) {
  const [geoFence, setGeoFence] = useState(true);
  const [privacyControls, setPrivacyControls] = useState(true);
  const [retention, setRetention] = useState("90 Days");
  const [retentionMenu, setRetentionMenu] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [iotStatus, setIotStatus] = useState("offline");
  const [activeTab, setActiveTab] = useState("General");

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => alert("Location access granted successfully!"),
        (err) => alert(`Location access denied or failed: ${err.message}`)
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const downloadJSON = () => {
    const sampleData = {
      exportedAt: new Date().toISOString(),
      records: [
        { id: 1, type: "Plastic", location: "Riverside Park", confidence: 94 },
        { id: 2, type: "Organic", location: "Market Street", confidence: 88 }
      ]
    };
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Detection_Data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const textData = "This is a mock PDF report containing monthly summaries.\n\nTotal Detections: 1,248\nPlastic: 476\nOrganic: 337";
    const blob = new Blob([textData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Monthly_Report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    alert("Report generated and downloaded!");
  };

  const checkUpdates = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      alert("System is already up to date! (v2.4.1)");
    }, 1500);
  };

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const clearHistory = () => {
    if(window.confirm("Are you sure you want to permanently delete all detection history? This action cannot be undone.")) {
      setIsClearing(true);
      setTimeout(() => {
        setIsClearing(false);
        alert("All detection history has been securely erased from the database.");
      }, 1500);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const newPassword = e.target.elements.newPassword.value;
    const confirmPassword = e.target.elements.confirmPassword.value;
    const sendEmail = e.target.elements.sendEmail.checked;

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    
    if (sendEmail) {
      alert("Password updated successfully! A confirmation email has been sent.");
    } else {
      alert("Password updated successfully!");
    }
    setChangePasswordOpen(false);
    e.target.reset();
  };

  return <div className="page-content settings-page" style={{ fontFamily: 'inherit', color: 'var(--ink)' }}>
      <div className="welcome-row">
        <div><div className="welcome-title">Settings</div><div className="welcome-sub">Manage your preferences, users, and system maintenance.</div></div>
      </div>
      <div className="settings-grid">
        <Card className="settings-nav" style={{ padding: '16px 12px' }}>
          <div className="settings-user">
            <div className="settings-avatar">AM</div>
            <b>Alex Morgan</b>
            <span>System Administrator</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '16px' }}>
            {[
              { id: "General", label: "General Settings", icon: Settings },
              { id: "Users", label: "Users & Roles", icon: Users },
              { id: "Maintenance", label: "System & Maintenance", icon: Wrench }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', width: '100%',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                    background: isActive ? 'var(--primary-soft)' : 'transparent',
                    color: isActive ? 'var(--primary-dark)' : 'var(--muted)',
                    textAlign: 'left', transition: '0.2s'
                  }}
                  onMouseEnter={(e) => !isActive && (e.currentTarget.style.background = 'var(--surface-2)', e.currentTarget.style.color = 'var(--ink)')}
                  onMouseLeave={(e) => !isActive && (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'var(--muted)')}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              )
            })}
          </div>
        </Card>

        <div className="settings-main">
          {activeTab === "General" && (
            <>
          <Card id="sec-Location">
            <SectionHead title="Location Settings" detail="Configure spatial boundaries and zones." />
            <div className="profile-fields"><label><span>Default city/area</span><Field placeholder="Green City Metro" /></label></div>
            <div className="preference-row">
              <div className="preference-icon"><Globe size={18} /></div>
              <div><b>GPS permissions</b><span>Allow browser to access your location.</span></div>
              <Button kind="secondary" onClick={requestLocation}>Request Access</Button>
            </div>
            <div className="preference-row">
              <div className="preference-icon"><Map size={18} /></div>
              <div><b>Geofencing</b><span>Only alert for detections within designated zones.</span></div>
              <button className={`toggle ${geoFence ? 'on' : ''}`} onClick={() => setGeoFence(!geoFence)}><span></span></button>
            </div>
          </Card>
          
          <Card id="sec-DataPrivacy">
            <SectionHead title="Data & Privacy" detail="Manage your data retention and exports." />
            <div className="preference-row">
              <div className="preference-icon"><Clock3 size={18} /></div>
              <div><b>Data retention period</b><span>How long detection records are kept.</span></div>
              <div style={{ position: 'relative' }}>
                <div className="select-pill" style={{ cursor: "pointer" }} onClick={() => setRetentionMenu(!retentionMenu)}>
                  {retention} <ChevronDown size={14} />
                </div>
                {retentionMenu && (
                  <div style={{ position: "absolute", top: "100%", right: "0", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px", padding: "6px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 50, minWidth: "120px", marginTop: "4px" }}>
                    {["30 Days", "90 Days", "1 Year"].map(opt => (
                       <button 
                         key={opt}
                         onClick={() => { setRetention(opt); setRetentionMenu(false); }}
                         style={{ display: "block", width: "100%", textAlign: "left", padding: "10px", fontSize: "12px", fontWeight: "600", background: "transparent", border: "none", cursor: "pointer", borderRadius: "5px", color: "var(--muted)" }}
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
            <div className="preference-row">
              <div className="preference-icon"><Database size={18} /></div>
              <div><b>Download detection data</b><span>Export raw JSON data for offline analysis.</span></div>
              <Button kind="secondary" onClick={downloadJSON}><Download size={14} /> Export JSON</Button>
            </div>
            <div className="preference-row">
              <div className="preference-icon"><FileBarChart size={18} /></div>
              <div><b>Export reports</b><span>Download monthly PDF summaries.</span></div>
              <Button kind="secondary" onClick={downloadPDF}><Download size={14} /> Download PDF</Button>
            </div>
            <div className="preference-row">
              <div className="preference-icon"><ShieldCheck size={18} /></div>
              <div><b>Privacy controls</b><span>Blur human faces and license plates automatically.</span></div>
              <button className={`toggle ${privacyControls ? 'on' : ''}`} onClick={() => setPrivacyControls(!privacyControls)}><span></span></button>
            </div>
            <div className="card-actions">
              <Button kind="danger" onClick={clearHistory} disabled={isClearing}>
                {isClearing ? "Clearing data..." : "Clear detection history"}
              </Button>
            </div>
          </Card>
          
          <Card id="sec-Security">
            <SectionHead 
              title="Security Settings" 
              detail="Keep your workspace secure." 
              action={<Button kind="secondary" onClick={() => setChangePasswordOpen(!changePasswordOpen)}>{changePasswordOpen ? "Cancel" : "Change password"}</Button>} 
            />
            {changePasswordOpen && (
              <form onSubmit={handlePasswordSubmit} style={{ padding: "10px 20px 20px", borderBottom: "1px solid var(--line)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input type="password" name="currentPassword" required placeholder="Current password" style={{ padding: "8px", borderRadius: "6px", border: "1px solid var(--line)" }} />
                  <input type="password" name="newPassword" required placeholder="New password" style={{ padding: "8px", borderRadius: "6px", border: "1px solid var(--line)" }} />
                  <input type="password" name="confirmPassword" required placeholder="Confirm new password" style={{ padding: "8px", borderRadius: "6px", border: "1px solid var(--line)" }} />
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer", userSelect: "none", color: "var(--muted)" }}>
                    <input type="checkbox" name="sendEmail" defaultChecked style={{ cursor: "pointer", width: "16px", height: "16px" }} />
                    Send confirmation email
                  </label>
                  <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                    <Button type="submit">Update Password</Button>
                  </div>
                </div>
              </form>
            )}
            <div className="security-note"><ShieldCheck size={19} /><div><b>Your account is protected</b><span>Two-factor authentication is enabled.</span></div></div>
            <div className="preference-row" style={{borderBottom: sessionsOpen ? "0" : undefined}}>
              <div className="preference-icon"><Monitor size={18} /></div>
              <div><b>Active sessions</b><span>Manage devices currently logged in.</span></div>
              <Button kind="secondary" onClick={() => setSessionsOpen(!sessionsOpen)}>{sessionsOpen ? "Close" : "View 2 devices"}</Button>
            </div>
            {sessionsOpen && <div style={{padding: "0 20px 20px"}}>
              <div style={{background: "var(--surface-2)", borderRadius: "8px", padding: "12px", marginBottom: "8px"}}><b>MacBook Pro</b><span style={{display: "block", color: "var(--muted)", fontSize: '14px'}}>Pune, MH · Chrome · <span style={{color: "var(--green)"}}>Current session</span></span></div>
              <div style={{background: "var(--surface-2)", borderRadius: "8px", padding: "12px"}}><b>iPhone 13</b><span style={{display: "block", color: "var(--muted)", fontSize: '14px'}}>Mumbai, MH · Safari · Last active: 2 hours ago</span></div>
            </div>}
            
            <div className="preference-row" style={{borderBottom: historyOpen ? "0" : undefined}}>
              <div className="preference-icon"><Key size={18} /></div>
              <div><b>Login history</b><span>Review recent authentication attempts.</span></div>
              <Button kind="secondary" onClick={() => setHistoryOpen(!historyOpen)}>{historyOpen ? "Close log" : "View log"}</Button>
            </div>
            {historyOpen && <div style={{padding: "0 20px 20px"}}>
              <div style={{background: "var(--surface-2)", borderRadius: "8px", padding: "12px", marginBottom: "8px", borderLeft: "3px solid var(--green)"}}><b>Successful login</b><span style={{display: "block", color: "var(--muted)", fontSize: '14px'}}>Sept 26, 14:30 · Chrome on MacOS · Pune, MH</span></div>
              <div style={{background: "var(--surface-2)", borderRadius: "8px", padding: "12px", borderLeft: "3px solid var(--green)"}}><b>Successful login</b><span style={{display: "block", color: "var(--muted)", fontSize: '14px'}}>Sept 25, 09:15 · Safari on iOS · Mumbai, MH</span></div>
            </div>}
          </Card>
          
          <Card id="sec-Appearance">
            <SectionHead title="Appearance" detail="Customize your visual experience." />
            <div className="preference-row">
              <div className="preference-icon"><Moon size={18} /></div>
              <div><b>Dark mode</b><span>Use a darker interface in low light.</span></div>
              <button className={`toggle ${dark ? 'on' : ''}`} onClick={onDark}><span></span></button>
            </div>
          </Card>
          </>
          )}

          {activeTab === "Users" && (
            <UserManagement embedded={true} />
          )}

          {activeTab === "Maintenance" && (
            <>
          
          <Card id="sec-SystemStatus">
            <SectionHead title="System Status" detail="Real-time operational health." />
            
            <div className="preference-row" style={{ cursor: 'pointer', padding: '14px 10px', margin: '0 10px', borderRadius: '8px', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} onClick={() => alert("AI Model v2.4.1 is running optimally with 99.8% uptime.")}>
              <div className="preference-icon" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}><Monitor size={18} /></div>
              <div><b>AI Model Status</b><span>v2.4.1 is running optimally with 99.8% uptime.</span></div>
              <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--green-soft)', color: 'var(--green-dark)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> Operational</span>
            </div>

            <div className="preference-row" style={{ cursor: 'pointer', padding: '14px 10px', margin: '0 10px', borderRadius: '8px', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} onClick={() => alert("API endpoints are responding in <50ms.")}>
              <div className="preference-icon" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}><Server size={18} /></div>
              <div><b>API Endpoints</b><span>Services are responding in &lt;50ms latency.</span></div>
              <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--green-soft)', color: 'var(--green-dark)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> Operational</span>
            </div>

            <div className="preference-row" style={{ cursor: 'pointer', padding: '14px 10px', margin: '0 10px', borderRadius: '8px', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} onClick={() => alert("Database is synced and healthy.")}>
              <div className="preference-icon" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}><Database size={18} /></div>
              <div><b>Database Sync</b><span>All records are fully synced and healthy.</span></div>
              <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--green-soft)', color: 'var(--green-dark)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> Operational</span>
            </div>

            <div className="preference-row" style={{ cursor: 'pointer', padding: '14px 10px', margin: '0 10px', borderRadius: '8px', transition: '0.2s', borderBottom: '1px solid var(--line)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} onClick={() => {
                  if (iotStatus === "offline") {
                    setIotStatus("reconnecting");
                    setTimeout(() => { setIotStatus("online"); alert("IoT Node successfully reconnected!"); }, 2000);
                  } else if (iotStatus === "online") {
                     alert("IoT Nodes are fully connected.");
                  }
                }}>
              <div className="preference-icon" style={{ background: iotStatus === 'online' ? 'var(--green-soft)' : 'var(--orange-soft)', color: iotStatus === 'online' ? 'var(--green)' : 'var(--orange)' }}><Globe size={18} /></div>
              <div><b>IoT Sensor Network</b><span>{iotStatus === 'online' ? "All nodes connected." : "Some nodes are currently unreachable."}</span></div>
              
              {iotStatus === "offline" && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--orange-soft)', color: 'var(--orange)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12} /> 1 node offline</span>
                  <Button kind="secondary" style={{ padding: '4px 12px', minHeight: 'auto', fontSize: '12px' }} onClick={() => {
                    setIotStatus("reconnecting");
                    setTimeout(() => { setIotStatus("online"); alert("IoT Node successfully reconnected!"); }, 2000);
                  }}>Reconnect</Button>
                </div>
              )}
              {iotStatus === "reconnecting" && (
                <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--surface-2)', color: 'var(--muted)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><RefreshCw size={12} className="spin" /> Reconnecting...</span>
              )}
              {iotStatus === "online" && (
                <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--green-soft)', color: 'var(--green-dark)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> Operational</span>
              )}
            </div>
            <div className="preference-row">
              <div className="preference-icon"><Server size={18} /></div>
              <div><b>Last system update</b><span>Core infrastructure updated smoothly.</span></div>
              <div style={{display: "flex", alignItems: "center", gap: 12}}>
                <b style={{fontSize: 13}}>Today at 03:00 AM</b>
                <Button kind="secondary" onClick={checkUpdates} disabled={isUpdating}>{isUpdating ? "Checking..." : "Check now"}</Button>
              </div>
            </div>
          </Card>

          <Card id="sec-MaintenanceLogs">
            <SectionHead title="Maintenance Tasks" detail="Routine maintenance schedules and logs." />
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--line)' }}>
                <div>
                  <b style={{ fontSize: '14px', display: 'block' }}>Database Optimization</b>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Scheduled every Sunday at 02:00 AM</span>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--green-soft)', color: 'var(--green-dark)', fontSize: '12px', fontWeight: 600 }}>Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
                <div>
                  <b style={{ fontSize: '14px', display: 'block' }}>Camera Lens Calibration</b>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Requires manual execution</span>
                </div>
                <Button kind="secondary" style={{ padding: '4px 12px' }} onClick={(e) => {
                  const btn = e.currentTarget;
                  btn.textContent = "Calibrating...";
                  btn.disabled = true;
                  setTimeout(() => {
                    btn.textContent = "Run Now";
                    btn.disabled = false;
                    alert("Camera Lens Calibration successful.");
                  }, 2000);
                }}>Run Now</Button>
              </div>
            </div>
          </Card>
          </>
          )}
        </div>
      </div>
    </div>;
}
