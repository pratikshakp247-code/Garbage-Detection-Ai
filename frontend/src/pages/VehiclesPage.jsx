import { useState, useMemo, useRef } from "react";
import { Search, Filter, Truck, CheckCircle, Clock3, AlertTriangle, XCircle, MapPin, Navigation, Settings, X, Calendar, User, Phone, Zap, FileText, Check } from "lucide-react";
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import StatCard from '../components/StatCard.jsx';
import SectionHead from '../components/SectionHead.jsx';

// Demo Data
const vehicles = [
  { id: "V-102", type: "Compactor", driver: "John Doe", driverId: "EMP-492", phone: "+1 (555) 019-2034", area: "Downtown", route: "RT-01", status: "On Route", progress: 45, lat: 40.712, lng: -74.006, lastUpdate: "2 mins ago", reg: "NYC-7482", capacity: "12 Tons", load: "45%", fuel: "78%", speed: "25 mph", gps: "Strong", lastService: "2025-04-15", nextService: "2025-07-15", collections: 24, top: "35%", left: "45%" },
  { id: "V-105", type: "Recycling", driver: "Sarah Smith", driverId: "EMP-215", phone: "+1 (555) 018-9921", area: "Riverside", route: "RT-04", status: "Collecting", progress: 70, lat: 40.720, lng: -74.010, lastUpdate: "Just now", reg: "NYC-8821", capacity: "8 Tons", load: "70%", fuel: "62%", speed: "0 mph", gps: "Strong", lastService: "2025-05-02", nextService: "2025-08-02", collections: 41, top: "50%", left: "20%" },
  { id: "V-204", type: "Compactor", driver: "Mike Johnson", driverId: "EMP-331", phone: "+1 (555) 012-4411", area: "Central Station", route: "RT-08", status: "Idle", progress: 100, lat: 40.710, lng: -74.001, lastUpdate: "15 mins ago", reg: "NYC-1093", capacity: "12 Tons", load: "0%", fuel: "95%", speed: "0 mph", gps: "Fair", lastService: "2025-01-10", nextService: "2025-06-10", collections: 65, top: "65%", left: "60%" },
  { id: "V-301", type: "Heavy Lift", driver: "David Lee", driverId: "EMP-822", phone: "+1 (555) 014-5522", area: "Harbor", route: "RT-02", status: "Maintenance", progress: 0, lat: 40.705, lng: -74.015, lastUpdate: "3 hours ago", reg: "NYC-3400", capacity: "15 Tons", load: "0%", fuel: "10%", speed: "0 mph", gps: "Offline", lastService: "2025-05-20", nextService: "2025-05-30", collections: 0, top: "20%", left: "70%" },
  { id: "V-118", type: "Mini Truck", driver: "Elena Rodriguez", driverId: "EMP-541", phone: "+1 (555) 017-8899", area: "Market Block", route: "RT-11", status: "Offline", progress: 0, lat: 40.730, lng: -73.990, lastUpdate: "1 day ago", reg: "NYC-9922", capacity: "5 Tons", load: "0%", fuel: "0%", speed: "0 mph", gps: "Offline", lastService: "2024-11-05", nextService: "2025-04-05", collections: 0, top: "80%", left: "30%" }
];

const getStatusColor = (status) => {
  switch (status) {
    case "On Route": return "var(--blue)"; // Blue
    case "Collecting": return "var(--green)"; // Green
    case "Idle": return "var(--muted)"; // Gray
    case "Maintenance": return "var(--orange)"; // Orange
    case "Offline": return "var(--red)"; // Red
    default: return "var(--ink)";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "On Route": return <Navigation size={14} />;
    case "Collecting": return <CheckCircle size={14} />;
    case "Idle": return <Clock3 size={14} />;
    case "Maintenance": return <Settings size={14} />;
    case "Offline": return <XCircle size={14} />;
    default: return <Truck size={14} />;
  }
};

export default function VehiclesPage() {
  const [filter, setFilter] = useState("All Vehicles");
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [fullMap, setFullMap] = useState(false);
  const mapRef = useRef(null);

  const toggleMap = () => {
    setFullMap(!fullMap);
    if (!fullMap) {
      setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchFilter = filter === "All Vehicles" || 
                          (filter === "Active" && (v.status === "On Route" || v.status === "Collecting")) || 
                          v.status === filter;
      const matchSearch = v.id.toLowerCase().includes(search.toLowerCase()) || 
                          v.driver.toLowerCase().includes(search.toLowerCase()) || 
                          v.area.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [filter, search]);

  const stats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === "On Route" || v.status === "Collecting").length,
    idle: vehicles.filter(v => v.status === "Idle").length,
    offline: vehicles.filter(v => v.status === "Offline").length,
    maintenance: vehicles.filter(v => v.status === "Maintenance").length
  };

  return (
    <div className="page-content" style={{ padding: '24px', fontFamily: 'inherit' }}>
      <SectionHead 
        title="Waste Collection Fleet" 
        subtitle="Live tracking and fleet management" 
        action={<Button onClick={toggleMap}><MapPin size={16} /> {fullMap ? "Collapse Map" : "Fleet Map View"}</Button>}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: '24px' }}>
        <StatCard label="Total Vehicles" value={stats.total} icon={Truck} tone="purple" />
        <StatCard label="Active / On Route" value={stats.active} icon={Navigation} tone="blue" />
        <StatCard label="Idle / At Depot" value={stats.idle} icon={Clock3} tone="orange" />
        <StatCard label="Offline" value={stats.offline} icon={XCircle} />
        <StatCard label="Maintenance" value={stats.maintenance} icon={Settings} />
      </div>

      <Card ref={mapRef} className="map-card" style={{ padding: 0, overflow: 'hidden', height: fullMap ? '75vh' : '400px', position: 'relative', marginBottom: '24px', transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        {/* Large Map Visual Element */}
        <div className="map-canvas map-large" style={{ width: '100%', height: '100%', background: 'var(--surface-sunken)', position: 'relative' }}>
          <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
          <div className="map-water" />
          <span className="map-label label-river">River Route</span>
          <span className="map-label label-center">City Center</span>

          {filteredVehicles.map(v => (
            <div key={v.id} onClick={() => setSelectedVehicle(v)} style={{
              position: 'absolute', top: v.top, left: v.left,
              width: '32px', height: '32px', borderRadius: '50%',
              background: getStatusColor(v.status),
              border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', transform: 'translate(-50%, -50%)',
              zIndex: 10
            }} title={`${v.id} - ${v.status}`}>
              <Truck size={16} color="white" />
              <div style={{ position: 'absolute', top: '-24px', background: 'var(--surface)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
                {v.id}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden' }}>
          {["All Vehicles", "Active", "On Route", "Idle", "Offline", "Maintenance"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', border: 'none', background: filter === f ? 'var(--blue)' : 'transparent',
              color: filter === f ? 'white' : 'var(--ink)', cursor: 'pointer', fontSize: '13px', fontWeight: 500
            }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '300px', marginLeft: 'auto' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            type="text" 
            placeholder="Search vehicle, driver or area..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--line)', borderRadius: '8px', fontSize: '13px', background: 'var(--surface)' }}
          />
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Driver</th>
                <th>Area / Route</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Last Update</th>
                <th align="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map(v => (
                <tr key={v.id}>
                  <td><b>{v.id}</b></td>
                  <td>{v.type}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                        {v.driver.split(' ').map(n => n[0]).join('')}
                      </div>
                      {v.driver}
                    </div>
                  </td>
                  <td>{v.area} <span style={{ color: 'var(--muted)', fontSize: '12px', display: 'block' }}>{v.route}</span></td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: `${getStatusColor(v.status)}15`, color: getStatusColor(v.status) }}>
                      {getStatusIcon(v.status)} {v.status}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                      <div style={{ flexGrow: 1, height: '6px', background: 'var(--surface-sunken)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                        <div style={{ width: `${v.progress}%`, height: '100%', background: getStatusColor(v.status) }} />
                      </div>
                      {v.progress}%
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{v.lastUpdate}</td>
                  <td align="right">
                    <Button kind="secondary" onClick={() => setSelectedVehicle(v)}>View Details</Button>
                  </td>
                </tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={8} align="center" style={{ padding: '32px', color: 'var(--muted)' }}>
                    No vehicles found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Driver & Vehicle Details Modal */}
      {selectedVehicle && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'var(--surface)', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 10 }}>
              <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Truck size={20} color="var(--blue)" />
                Vehicle {selectedVehicle.id} Details
              </h2>
              <button onClick={() => setSelectedVehicle(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Driver Info */}
              <div style={{ background: 'var(--surface-sunken)', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> Driver Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue-pale), var(--blue))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                    {selectedVehicle.driver.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <b style={{ fontSize: '18px', display: 'block' }}>{selectedVehicle.driver}</b>
                    <span style={{ color: 'var(--muted)', fontSize: '13px' }}>ID: {selectedVehicle.driverId}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}><Phone size={14} style={{verticalAlign:'middle', marginRight:'6px'}}/>Contact Number</span> <b>{selectedVehicle.phone}</b></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Assigned Area</span> <b>{selectedVehicle.area}</b></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Shift Timing</span> <b>08:00 AM - 04:00 PM</b></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Collections Today</span> <b>{selectedVehicle.collections} stops</b></div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div style={{ background: 'var(--surface-sunken)', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={16} /> Vehicle Status</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', background: `${getStatusColor(selectedVehicle.status)}15`, color: getStatusColor(selectedVehicle.status), fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getStatusIcon(selectedVehicle.status)} {selectedVehicle.status}
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Last GPS: {selectedVehicle.lastUpdate}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Registration</span> <b>{selectedVehicle.reg}</b></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Vehicle Type</span> <b>{selectedVehicle.type}</b></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Capacity & Load</span> <b>{selectedVehicle.capacity} ({selectedVehicle.load} Full)</b></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}><Zap size={14} style={{verticalAlign:'middle', marginRight:'6px'}}/>Fuel Level</span> <b>{selectedVehicle.fuel}</b></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Current Speed</span> <b>{selectedVehicle.speed}</b></div>
                </div>
              </div>
            </div>

            <div style={{ padding: '0 24px 24px 24px' }}>
              <div style={{ background: 'var(--surface-sunken)', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Route Progress: {selectedVehicle.route}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginBottom: '8px' }}>
                  <div style={{ position: 'absolute', top: '12px', left: '20px', right: '20px', height: '2px', background: 'var(--line)', zIndex: 1 }} />
                  <div style={{ position: 'absolute', top: '12px', left: '20px', width: `${selectedVehicle.progress}%`, height: '2px', background: 'var(--blue)', zIndex: 2 }} />
                  
                  {['Assigned', 'On Route', 'Collecting', 'Completed'].map((step, i) => {
                    const stepProgress = i * 33.33;
                    const isDone = selectedVehicle.progress >= stepProgress;
                    const isActive = selectedVehicle.progress > (i-1)*33.33 && selectedVehicle.progress < (i+1)*33.33;
                    return (
                      <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 3, background: 'var(--surface-sunken)', padding: '0 10px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: isDone ? 'var(--blue)' : 'var(--surface)', border: `2px solid ${isDone ? 'var(--blue)' : 'var(--line)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          {isDone && <Check size={12} />}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: isActive ? 'bold' : 'normal', color: isDone ? 'var(--ink)' : 'var(--muted)' }}>{step}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button kind="secondary" onClick={() => alert("Loading full route details...")}><MapPin size={16} /> View Route</Button>
              <Button kind="secondary" onClick={() => alert("Connecting to driver...")}><Phone size={16} /> Contact Driver</Button>
              <Button onClick={() => setSelectedVehicle(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
