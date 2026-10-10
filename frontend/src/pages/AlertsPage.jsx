import { useState, useMemo } from "react";
import { AlertTriangle, Clock3, CheckCircle, Navigation, MapPin, Search, Filter, AlertOctagon, Info, ArrowRight, X, User, Settings, Video, Truck, Check, Phone } from "lucide-react";
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import StatCard from '../components/StatCard.jsx';
import SectionHead from '../components/SectionHead.jsx';

// Demo Data
const initialAlerts = [
  { id: "ALT-905", type: "Sensor Error", location: "Industrial Zone 2", lat: 40.735, lng: -73.985, time: "2026-10-03 12:05 PM", priority: "Critical", related: "Sensor S-88", assigned: "Unassigned", status: "New", description: "Gas/Fill-level sensor returned erratic readings indicating possible physical damage or battery failure.", top: "15%", left: "85%" },
  { id: "ALT-902", type: "Garbage Overflow", location: "City Center Plaza", lat: 40.715, lng: -74.002, time: "2026-10-03 08:15 AM", priority: "Critical", related: "Camera 04", assigned: "Unassigned", status: "New", description: "Critical waste overflow detected near main entrance.", image: true, top: "45%", left: "30%" },
  { id: "ALT-891", type: "Vehicle Offline", location: "Riverside Depot", lat: 40.720, lng: -74.015, time: "2026-10-03 09:30 AM", priority: "High", related: "V-102 (Compactor)", assigned: "John Doe", status: "In Progress", description: "GPS signal lost for Vehicle V-102. Last known position logged.", top: "25%", left: "20%", driver: "Ramesh Patil", driverContact: "+91 98765 43210" },
  { id: "ALT-884", type: "Missed Collection", location: "Downtown Alley B", lat: 40.710, lng: -74.005, time: "2026-10-03 10:05 AM", priority: "Medium", related: "Route RT-01", assigned: "Sarah Smith", status: "Assigned", description: "Scheduled collection missed. Bin capacity at 90%.", top: "60%", left: "50%", driver: "Suresh Jadhav", driverContact: "+91 99887 76655" },
  { id: "ALT-877", type: "Camera Offline", location: "North Avenue", lat: 40.730, lng: -73.990, time: "2026-10-02 04:20 PM", priority: "Medium", related: "Camera 12", assigned: "IT Support", status: "Resolved", description: "Network disconnected. Rebooted remotely and back online.", top: "75%", left: "80%", resolvedTime: "2026-10-02 05:10 PM", resolutionNotes: "Remote reboot successful. Firmware updated." },
  { id: "ALT-895", type: "High Garbage Accumulation", location: "Market Block 4", lat: 40.725, lng: -73.995, time: "2026-10-03 11:10 AM", priority: "High", related: "Sensor S-44", assigned: "Unassigned", status: "New", description: "Organic waste level critically high. Immediate clearing required.", top: "35%", left: "70%" },
  { id: "ALT-860", type: "Sensor Malfunction", location: "Park Avenue", lat: 40.718, lng: -74.008, time: "2026-10-02 09:00 AM", priority: "Low", related: "Sensor S-12", assigned: "Maintenance Team", status: "Resolved", description: "Battery depleted.", top: "50%", left: "60%", resolvedTime: "2026-10-02 11:30 AM", resolutionNotes: "Battery replaced and recalibrated." }
];

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Critical": return "#D64545"; // Red
    case "High": return "#D98A00"; // Orange
    case "Medium": return "#3B82F6"; // Blue
    default: return "#64748b"; // Gray
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "New": return "#D64545";
    case "Assigned": return "#3B82F6";
    case "In Progress": return "#D98A00";
    case "Resolved": return "#168A5B"; // Green
    default: return "#64748b";
  }
};

const getPriorityBgColor = (priority) => {
  switch (priority) {
    case "Critical": return "#FEE2E2";
    case "High": return "#FEF3C7";
    case "Medium": return "#DBEAFE";
    default: return "#F1F5F9";
  }
};

const getStatusBgColor = (status) => {
  switch (status) {
    case "New": return "#FEE2E2";
    case "Assigned": return "#DBEAFE";
    case "In Progress": return "#FEF3C7";
    case "Resolved": return "#D1FAE5";
    default: return "#F1F5F9";
  }
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const stats = useMemo(() => {
    return {
      active: alerts.filter(a => a.status !== "Resolved").length,
      highPriority: alerts.filter(a => (a.priority === "Critical" || a.priority === "High") && a.status !== "Resolved").length,
      inProgress: alerts.filter(a => a.status === "In Progress" || a.status === "Assigned").length,
      resolvedToday: alerts.filter(a => a.status === "Resolved" && a.resolvedTime?.includes("2026-10-03")).length
    };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const matchFilter = filter === "All" || 
                          (filter === "Critical" && a.priority === "Critical") ||
                          (filter === "High" && a.priority === "High") ||
                          (filter === "Medium" && a.priority === "Medium") ||
                          (filter === "Low" && a.priority === "Low") ||
                          (filter === "Sensor Issues" && a.type.toLowerCase().includes("sensor")) ||
                          (filter === "New" && a.status === "New") ||
                          (filter === "In Progress" && (a.status === "In Progress" || a.status === "Assigned")) ||
                          (filter === "Resolved" && a.status === "Resolved");
      
      const searchLower = search.toLowerCase();
      const matchSearch = a.id.toLowerCase().includes(searchLower) ||
                          a.location.toLowerCase().includes(searchLower) ||
                          a.related.toLowerCase().includes(searchLower) ||
                          a.type.toLowerCase().includes(searchLower);
      return matchFilter && matchSearch;
    });
  }, [alerts, filter, search]);

  const handleAction = (alert, action) => {
    const updated = alerts.map(a => {
      if (a.id === alert.id) {
        if (action === "Assign") return { ...a, status: "Assigned", assigned: "Current User" };
        if (action === "In Progress") return { ...a, status: "In Progress" };
        if (action === "Resolve") return { ...a, status: "Resolved", resolvedTime: "Just now", resolutionNotes: "Resolved manually by admin." };
      }
      return a;
    });
    setAlerts(updated);
    if (selectedAlert?.id === alert.id) {
      setSelectedAlert(updated.find(a => a.id === alert.id));
    }
  };

  return (
    <div className="page-content" style={{ padding: '24px', fontFamily: 'inherit' }}>
      <SectionHead 
        title="Alerts & Incidents" 
        subtitle="Manage, track, and resolve system and field incidents"
      />

      {/* Summary Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px', gap: '16px' }}>
        <StatCard label="Total Active Alerts" value={stats.active} icon={AlertTriangle} tone="red" />
        <StatCard label="High Priority" value={stats.highPriority} icon={AlertOctagon} tone="orange" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock3} tone="blue" />
        <StatCard label="Resolved Today" value={stats.resolvedToday} icon={CheckCircle} tone="green" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(280px, 0.7fr)', gap: '24px', marginBottom: '24px' }}>
        
        {/* Main Content (Filters + Table) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden', flexWrap: 'wrap' }}>
              {["All", "Critical", "High", "Medium", "Low", "Sensor Issues", "New", "In Progress", "Resolved"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '8px 14px', border: 'none', background: filter === f ? 'var(--primary-soft)' : 'transparent',
                  color: filter === f ? 'var(--primary)' : 'var(--ink)', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  borderRight: '1px solid var(--line)'
                }}>
                  {f}
                </button>
              ))}
            </div>
            <div style={{ position: 'relative', flexGrow: 1, maxWidth: '280px', marginLeft: 'auto' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input 
                type="text" 
                placeholder="Search ID, Location, Type..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--line)', borderRadius: '8px', fontSize: '13px', background: 'var(--surface)' }}
              />
            </div>
          </div>

          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-scroll">
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--line)' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--muted)' }}>Alert ID</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--muted)' }}>Type & Location</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--muted)' }}>Priority</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--muted)' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--muted)' }}>Time</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: 'var(--muted)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--line)', cursor: 'pointer' }} onClick={() => setSelectedAlert(a)} onMouseEnter={(e) => e.currentTarget.style.background='var(--surface-2)'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', fontSize: '13px' }}>{a.id}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{a.type}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '2px' }}>{a.location} • {a.related}</div>
                        {a.driver && (
                          <div style={{ color: 'var(--primary)', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <Phone size={10} /> {a.driver} - {a.driverContact}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: getPriorityColor(a.priority), fontSize: '12px', fontWeight: 700 }}>
                          {a.priority === "Critical" ? <AlertOctagon size={14} /> : <AlertTriangle size={14} />} {a.priority}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', background: getStatusBgColor(a.status), color: getStatusColor(a.status), fontSize: '12px', fontWeight: 600 }}>
                          {a.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: '12px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{a.time.split(' ')[1]} {a.time.split(' ')[2]}</div>
                        <div style={{ fontSize: '11px', marginTop: '2px' }}>{a.time.split(' ')[0]}</div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <Button kind="secondary" style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '12px' }} onClick={(e) => { e.stopPropagation(); setSelectedAlert(a); }}>
                          View <ArrowRight size={12} style={{ marginLeft: '4px' }} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredAlerts.length === 0 && (
                    <tr>
                      <td colSpan={6} align="center" style={{ padding: '40px', color: 'var(--muted)' }}>No alerts found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Map & Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <Card style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> Live Incident Map</h3>
            <div className="map-canvas" style={{ width: '100%', height: '220px', margin: 0, borderRadius: '12px', position: 'relative' }}>
              <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
              {alerts.filter(a => a.status !== "Resolved").map(a => (
                <div key={a.id} onClick={() => setSelectedAlert(a)} style={{
                  position: 'absolute', top: a.top, left: a.left,
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: getPriorityColor(a.priority),
                  border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }} title={a.id}>
                  {a.priority === "Critical" ? <AlertOctagon size={12} color="white" /> : <Info size={12} color="white" />}
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock3 size={16} /> Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {alerts.slice(0, 4).map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getStatusColor(a.status), marginTop: '4px', zIndex: 2, border: '2px solid white', boxShadow: `0 0 0 2px ${getStatusBgColor(a.status)}` }} />
                  {i < 3 && <div style={{ position: 'absolute', left: '4px', top: '16px', bottom: '-16px', width: '2px', background: 'var(--line)', zIndex: 1 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.type}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{a.id} • {a.status}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>{a.time.split(' ')[1]} {a.time.split(' ')[2]}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'var(--surface)', width: '100%', maxWidth: '480px', height: '100%', overflowY: 'auto', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h2 style={{ margin: 0, fontSize: '18px' }}>{selectedAlert.id}</h2>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', background: getStatusBgColor(selectedAlert.status), color: getStatusColor(selectedAlert.status), fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                    {selectedAlert.status}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Detected: {selectedAlert.time}</div>
              </div>
              <button onClick={() => setSelectedAlert(null)} style={{ background: 'var(--surface-2)', border: 'none', cursor: 'pointer', color: 'var(--muted)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='var(--line)'} onMouseLeave={(e) => e.currentTarget.style.background='var(--surface-2)'}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px', flex: 1 }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '16px', background: 'var(--surface-2)', borderRadius: '12px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: getPriorityBgColor(selectedAlert.priority), color: getPriorityColor(selectedAlert.priority), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedAlert.priority === "Critical" ? <AlertOctagon size={26} /> : <AlertTriangle size={26} />}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '17px' }}>{selectedAlert.type}</h3>
                  <div style={{ color: getPriorityColor(selectedAlert.priority), fontSize: '13px', fontWeight: 700 }}>Priority: {selectedAlert.priority}</div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px 0', letterSpacing: '0.5px' }}>Description</h4>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--ink)' }}>{selectedAlert.description}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px', padding: '16px', background: 'var(--surface-2)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                  <MapPin size={18} color="var(--muted)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '2px' }}>Location</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedAlert.location}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                  {selectedAlert.related.includes('Camera') ? <Video size={18} color="var(--muted)" style={{ marginTop: '2px' }} /> : <Truck size={18} color="var(--muted)" style={{ marginTop: '2px' }} />}
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '2px' }}>Related Entity</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedAlert.related}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: selectedAlert.driver ? '16px' : '0', borderBottom: selectedAlert.driver ? '1px solid var(--line)' : 'none' }}>
                  <User size={18} color="var(--muted)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '2px' }}>Assigned Staff</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedAlert.assigned}</div>
                  </div>
                </div>

                {selectedAlert.driver && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Phone size={18} color="var(--muted)" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '2px' }}>Driver Info</div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedAlert.driver}</div>
                      <div style={{ fontSize: '13px', color: 'var(--primary)', marginTop: '2px', cursor: 'pointer', fontWeight: 500 }}>{selectedAlert.driverContact}</div>
                    </div>
                  </div>
                )}
              </div>

              {selectedAlert.status === "Resolved" && (
                <div style={{ padding: '16px', background: 'var(--green-soft)', borderRadius: '12px', marginBottom: '24px', border: '1px solid #bbf7d0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green-dark)', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
                    <CheckCircle size={16} /> Resolved at {selectedAlert.resolvedTime}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--green-dark)', lineHeight: 1.5 }}>{selectedAlert.resolutionNotes}</div>
                </div>
              )}

              {selectedAlert.image && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px 0', letterSpacing: '0.5px' }}>Evidence / Snapshot</h4>
                  <div style={{ width: '100%', height: '180px', background: 'var(--surface-sunken)', borderRadius: '12px', border: '1px solid var(--line)', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, #e2e8f0, #f1f5f9)', opacity: 0.8 }} />
                    <span style={{ position: 'relative', zIndex: 1, fontSize: '13px', color: 'var(--muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Video size={16} /> Camera Snapshot Preview
                    </span>
                  </div>
                </div>
              )}

            </div>

            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--line)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedAlert.status === "New" && (
                <Button className="full" onClick={() => handleAction(selectedAlert, "Assign")} style={{ padding: '12px' }}>Assign to Me</Button>
              )}
              {selectedAlert.status === "Assigned" && (
                <Button className="full" onClick={() => handleAction(selectedAlert, "In Progress")} style={{ padding: '12px' }}>Mark as In Progress</Button>
              )}
              {selectedAlert.status === "In Progress" && (
                <Button className="full" onClick={() => handleAction(selectedAlert, "Resolve")} style={{ padding: '12px' }}>Resolve Incident</Button>
              )}
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button kind="secondary" style={{ flex: 1, padding: '10px' }}><MapPin size={16} /> View on Map</Button>
                {selectedAlert.related.includes('Camera') && <Button kind="secondary" style={{ flex: 1, padding: '10px' }}><Video size={16} /> Camera Feed</Button>}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
