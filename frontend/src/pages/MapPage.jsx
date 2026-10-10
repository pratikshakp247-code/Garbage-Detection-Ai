import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle, Calendar, ChevronDown, Focus, Layers, Leaf, Minus, Plus, Search, Video, X
} from "lucide-react";
import Card from '../components/Card.jsx';
import MiniMap from '../components/MiniMap.jsx';

export default function MapPage({ navigate }) {
  const [time, setTime] = useState("24 hours");
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const timeMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (timeMenuRef.current && !timeMenuRef.current.contains(event.target)) {
        setShowTimeMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    hotspot: true,
    camera: true,
    clean: true,
    warning: true
  });
  
  const toggleFilter = (key) => {
    setActiveFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const times = ["1st hour", "24 hours", "week", "month", "year"];

  return (
    <div className="page-content map-page" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '16px', flexShrink: 0 }}>
        <div>
           <div className="welcome-title">City Waste Map</div>
           <div className="welcome-sub">Live and real-time overview of waste detection and cleanup status.</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Card style={{padding: '12px 18px', minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '13px', fontWeight: 'bold'}}><Video size={14} color="var(--primary)"/> Total Cameras</div>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}><b style={{fontSize: '22px'}}>12</b><span style={{color: 'var(--green)', fontSize: '13px', fontWeight: 'bold'}}>▲ 2 online</span></div>
            </Card>
            <Card style={{padding: '12px 18px', minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '13px', fontWeight: 'bold'}}><Leaf size={14} color="var(--blue)"/> Active Sensors</div>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}><b style={{fontSize: '22px'}}>18</b><span style={{color: 'var(--green)', fontSize: '13px', fontWeight: 'bold'}}>▲ 1 new</span></div>
            </Card>
            <Card style={{padding: '12px 18px', minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '13px', fontWeight: 'bold'}}><AlertTriangle size={14} color="var(--red)"/> Active Alerts</div>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}><b style={{fontSize: '22px'}}>5</b><span style={{color: 'var(--red)', fontSize: '13px', fontWeight: 'bold'}}>▲ 2 high</span></div>
            </Card>
          <div ref={timeMenuRef} style={{position: 'relative'}}>
            <div className="select-pill" style={{cursor: 'pointer'}} onClick={() => setShowTimeMenu(!showTimeMenu)}>
              <Calendar size={14}/> {time} <ChevronDown size={14} />
            </div>
            {showTimeMenu && (
              <div style={{position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 50, minWidth: '160px'}}>
                {times.map(t => (
                  <button key={t} className="dropdown-item" onClick={() => { setTime(t); setShowTimeMenu(false); }}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Card style={{padding: 0, position: 'relative', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column'}}>
         <div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>
            <div style={{transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.3s ease', width: '100%', height: '100%'}}>
               <MiniMap large onMarkerClick={(msg) => { alert(`Navigating to details for: ${msg}`); navigate("History"); }} filters={activeFilters} />
            </div>
         </div>
         
         <div style={{position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 6}}>
            <button className="icon-button" style={{background: 'var(--surface)', padding: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}} onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}><Plus size={16}/></button>
            <button className="icon-button" style={{background: 'var(--surface)', padding: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}} onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}><Minus size={16}/></button>
            <button className="icon-button" style={{background: 'var(--surface)', padding: 8, marginTop: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}} onClick={() => setZoom(1)}><Focus size={16}/></button>
            <button className="icon-button" style={{background: 'var(--surface)', padding: 8, marginTop: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}} onClick={() => alert("Toggling Map Layers: Traffic & Weather")}><Layers size={16}/></button>
         </div>
         
         <div className="map-search" style={{top: 16, right: 'auto', left: 60, width: '260px', background: 'var(--surface)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: 'none', display: 'flex', alignItems: 'center'}}>
            <Search size={17} style={{flexShrink: 0}} />
            <input placeholder="Search location..." value={search} onChange={(e) => setSearch(e.target.value)} style={{flex: 1, border: 'none', outline: 'none', background: 'transparent'}} onKeyDown={(e) => { if (e.key === 'Enter') { setZoom(2.5); } }} />
            {search && (
               <X size={15} style={{cursor: 'pointer', flexShrink: 0, color: 'var(--muted)'}} onClick={() => { setSearch(""); setZoom(1); }} />
            )}
         </div>
         
         <div className="map-legend" style={{position: 'absolute', bottom: 16, left: 16, padding: '12px 20px', background: 'var(--surface)', display: 'flex', gap: '20px', fontSize: '13px', fontWeight: 'bold', color: 'var(--muted)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', flexWrap: 'wrap', userSelect: 'none'}}>
            <span style={{display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: activeFilters.hotspot ? 1 : 0.4, transition: '.2s'}} onClick={() => toggleFilter('hotspot')}><div style={{width: 10, height: 10, borderRadius: '50%', background: 'var(--red)'}}/> Garbage Hotspot</span>
            <span style={{display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: activeFilters.camera ? 1 : 0.4, transition: '.2s'}} onClick={() => toggleFilter('camera')}><div style={{width: 10, height: 10, borderRadius: '50%', background: 'var(--blue)'}}/> Active Camera</span>
            <span style={{display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: activeFilters.clean ? 1 : 0.4, transition: '.2s'}} onClick={() => toggleFilter('clean')}><div style={{width: 10, height: 10, borderRadius: '50%', background: 'var(--green)'}}/> Clean Area</span>
            <span style={{display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: activeFilters.warning ? 1 : 0.4, transition: '.2s'}} onClick={() => toggleFilter('warning')}><div style={{width: 10, height: 10, borderRadius: '50%', background: 'var(--orange)'}}/> Warning</span>
         </div>
      </Card>
    </div>
  );
}
