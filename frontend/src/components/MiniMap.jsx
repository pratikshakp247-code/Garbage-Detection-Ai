import { AlertTriangle, Camera, Check, Trash2, Truck } from "lucide-react";

export default function MiniMap({ large = false, onMarkerClick, filters = { hotspot: true, clean: true, warning: true, camera: true } }) {
  const handleClick = (msg) => {
    if (onMarkerClick) onMarkerClick(msg);
    else alert(`Marker clicked: ${msg}`);
  };

  return <div className={`map-canvas ${large ? "map-large" : ""}`}>
      <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
      <div className="map-water" />
      <span className="map-label label-river">North River</span>
      <span className="map-label label-center">Central District</span>
      <span className="map-label label-park">Riverside Park</span>
      
      {filters.hotspot && (
        <>
          <div className="marker marker-one" style={{cursor: 'pointer'}} onClick={() => handleClick("Central District - Plastic")}><Trash2 size={13} /></div>
          <div className="marker marker-two" style={{cursor: 'pointer'}} onClick={() => handleClick("Riverside Park - Organic")}><Trash2 size={13} /></div>
          <div className="marker marker-four" style={{cursor: 'pointer'}} onClick={() => handleClick("Market Street - Plastic")}><Trash2 size={13} /></div>
        </>
      )}
      
      {filters.clean && (
        <>
          <div className="marker marker-three clean" style={{cursor: 'pointer'}} onClick={() => handleClick("North River - Clean")}><Check size={13} /></div>
          {large && <div className="marker marker-five clean" style={{cursor: 'pointer'}} onClick={() => handleClick("South End - Clean")}><Check size={13} /></div>}
        </>
      )}

      {filters.warning && large && (
        <div className="marker marker-six warning" style={{cursor: 'pointer'}} onClick={() => handleClick("Central District - High Priority")}><AlertTriangle size={13} /></div>
      )}

      {filters.camera && large && (
        <div className="marker camera" style={{top: '60%', left: '70%', background: 'var(--blue)', cursor: 'pointer'}} onClick={() => handleClick("Camera 12 - Active")}><Camera size={13} /></div>
      )}
      
      {/* Garbage Truck Marker */}
      <div className="marker truck" style={{top: '40%', left: '15%', background: '#1e293b', borderRadius: '50%', transform: 'none', zIndex: 10, cursor: 'pointer', border: '2px solid white', width: '32px', height: '32px'}} onClick={() => handleClick("Garbage Truck 1 - On Route")}>
         <Truck size={16} style={{transform: 'none', color: '#60A5FA'}} />
      </div>
    </div>;
}
