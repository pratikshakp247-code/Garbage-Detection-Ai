import { useState } from "react";
import { AlertTriangle, Camera, Check, Trash2, Truck, ShieldCheck, MapPin } from "lucide-react";

export default function MiniMap({
  large = false,
  onMarkerClick,
  filters = { hotspot: true, clean: true, warning: true, camera: true }
}) {
  const [hoveredInfo, setHoveredInfo] = useState(null);

  const handleClick = (msg) => {
    if (onMarkerClick) onMarkerClick(msg);
    else alert(`Marker clicked: ${msg}`);
  };

  const markersList = [
    {
      id: "m1",
      type: "hotspot",
      className: "marker marker-one",
      name: "Central District",
      detail: "Plastic Waste",
      value: "45 kg detected",
      confidence: "96%",
      status: "Assigned for Pickup",
      top: "28%",
      left: "25%",
      icon: Trash2
    },
    {
      id: "m2",
      type: "hotspot",
      className: "marker marker-two",
      name: "Riverside Park",
      detail: "Organic Waste",
      value: "32 kg detected",
      confidence: "92%",
      status: "Pickup Scheduled",
      top: "58%",
      left: "58%",
      icon: Trash2
    },
    {
      id: "m4",
      type: "hotspot",
      className: "marker marker-four",
      name: "Market Street",
      detail: "Plastic & Paper",
      value: "68 kg detected",
      confidence: "94%",
      status: "In Progress",
      top: "70%",
      left: "36%",
      icon: Trash2
    },
    {
      id: "m3",
      type: "clean",
      className: "marker marker-three clean",
      name: "North River Bank",
      detail: "Cleaned Zone",
      value: "0 kg (Clean)",
      confidence: "100%",
      status: "Sanitized Today",
      top: "18%",
      left: "70%",
      icon: Check
    },
    {
      id: "m5",
      type: "clean",
      className: "marker marker-five clean",
      name: "South End Promenade",
      detail: "Cleaned Zone",
      value: "0 kg (Clean)",
      confidence: "100%",
      status: "Verified by Fleet",
      top: "42%",
      left: "80%",
      icon: Check,
      largeOnly: true
    },
    {
      id: "m6",
      type: "warning",
      className: "marker marker-six warning",
      name: "Central Overpass",
      detail: "Overflow Risk",
      value: "88 kg High Density",
      confidence: "98%",
      status: "High Priority Alert",
      top: "22%",
      left: "48%",
      icon: AlertTriangle,
      largeOnly: true
    },
    {
      id: "m7",
      type: "camera",
      className: "marker camera",
      name: "CCTV Camera 12",
      detail: "AI Edge Camera",
      value: "1080p Live Stream",
      confidence: "Online",
      status: "Continuous Monitoring",
      top: "60%",
      left: "70%",
      icon: Camera,
      largeOnly: true
    },
    {
      id: "m8",
      type: "truck",
      className: "marker truck",
      name: "Fleet Vehicle #01",
      detail: "EV Waste Truck",
      value: "78% Bin Capacity",
      confidence: "GPS Active",
      status: "En Route to Zone 2",
      top: "40%",
      left: "15%",
      icon: Truck
    }
  ];

  return (
    <div className={`map-canvas ${large ? "map-large" : ""}`} style={{ position: "relative" }}>
      <div className="map-road road-one" />
      <div className="map-road road-two" />
      <div className="map-road road-three" />
      <div className="map-water" />
      <span className="map-label label-river">North River</span>
      <span className="map-label label-center">Central District</span>
      <span className="map-label label-park">Riverside Park</span>

      {/* Render All Filtered Interactive Markers */}
      {markersList.map((m) => {
        if (m.largeOnly && !large) return null;
        if (m.type === "hotspot" && !filters.hotspot) return null;
        if (m.type === "clean" && !filters.clean) return null;
        if (m.type === "warning" && !filters.warning) return null;
        if (m.type === "camera" && !filters.camera) return null;

        const Icon = m.icon;
        const isTruck = m.type === "truck";

        return (
          <div
            key={m.id}
            className={m.className}
            style={{
              top: m.top,
              left: m.left,
              cursor: "pointer",
              transition: "transform 0.15s ease",
              ...(isTruck
                ? {
                    background: "#1e293b",
                    borderRadius: "50%",
                    transform: "none",
                    zIndex: 10,
                    border: "2px solid white",
                    width: "32px",
                    height: "32px"
                  }
                : {})
            }}
            onMouseEnter={() => setHoveredInfo(m)}
            onMouseLeave={() => setHoveredInfo(null)}
            onClick={() => handleClick(`${m.name} - ${m.detail}`)}
          >
            <Icon
              size={isTruck ? 16 : 13}
              style={{
                transform: isTruck ? "none" : undefined,
                color: isTruck ? "#60A5FA" : undefined
              }}
            />
          </div>
        );
      })}

      {/* Floating Cursor Hover Tooltip for Map Markers */}
      {hoveredInfo && (
        <div
          style={{
            position: "absolute",
            top: `calc(${hoveredInfo.top} - 82px)`,
            left: hoveredInfo.left,
            transform: "translateX(-50%)",
            zIndex: 40,
            background: "#0F172A",
            color: "#FFFFFF",
            padding: "9px 13px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
            pointerEvents: "none",
            minWidth: "165px",
            border: "1px solid rgba(255,255,255,0.15)",
            animation: "tooltip-slide 0.15s ease-out"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <MapPin size={13} color="#60A5FA" />
            <b style={{ fontSize: "12px", color: "#F8FAFC" }}>{hoveredInfo.name}</b>
          </div>
          <div style={{ fontSize: "11px", color: "#93C5FD", marginBottom: "2px" }}>
            {hoveredInfo.detail} • <b>{hoveredInfo.value}</b>
          </div>
          <div style={{ fontSize: "10.5px", color: "#34D399", fontWeight: "600" }}>
            ● {hoveredInfo.status}
          </div>
        </div>
      )}
    </div>
  );
}
