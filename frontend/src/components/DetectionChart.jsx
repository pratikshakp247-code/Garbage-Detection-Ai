import { useState } from "react";
import { TrendingUp, AlertTriangle, CheckCircle2, Bot } from "lucide-react";

export default function DetectionChart({ range, timeRange }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const activeRange = range || timeRange || "This week";

  const datasets = {
    "Today": {
      data: [
        { d: 15, c: 10 },
        { d: 22, c: 20 },
        { d: 18, c: 15 },
        { d: 30, c: 25 },
        { d: 25, c: 20 },
        { d: 35, c: 30 },
        { d: 20, c: 15 }
      ],
      labels: ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"],
      fullLabels: ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"],
      max: 40
    },
    "This week": {
      data: [
        { d: 45, c: 30 },
        { d: 68, c: 60 },
        { d: 54, c: 50 },
        { d: 85, c: 75 },
        { d: 72, c: 65 },
        { d: 105, c: 95 },
        { d: 90, c: 80 }
      ],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      fullLabels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      max: 120
    },
    "This month": {
      data: [
        { d: 350, c: 300 },
        { d: 420, c: 380 },
        { d: 380, c: 350 },
        { d: 510, c: 480 },
        { d: 480, c: 450 }
      ],
      labels: ["W1", "W2", "W3", "W4", "W5"],
      fullLabels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
      max: 600
    },
    "This year": {
      data: [
        { d: 1200, c: 1100 },
        { d: 1400, c: 1300 },
        { d: 1150, c: 1000 },
        { d: 1600, c: 1500 },
        { d: 1800, c: 1700 },
        { d: 1550, c: 1400 }
      ],
      labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
      fullLabels: ["January", "March", "May", "July", "September", "November"],
      max: 2000
    }
  };

  const currentDataset = datasets[activeRange] || datasets["This week"];
  const { data, labels, fullLabels, max } = currentDataset;

  const totalDetected = data.reduce((acc, curr) => acc + curr.d, 0);
  const totalCleaned = data.reduce((acc, curr) => acc + curr.c, 0);
  const efficiency = Math.round((totalCleaned / totalDetected) * 100);

  return (
    <div className="detection-chart-container">
      {/* Top Chart Metric Summary Bar */}
      <div className="chart-quick-summary">
        <div className="summary-chip detected">
          <span className="chip-dot blue" />
          <span className="chip-label">Total Detected:</span>
          <b>{totalDetected}</b>
        </div>
        <div className="summary-chip cleaned">
          <span className="chip-dot green" />
          <span className="chip-label">Total Cleaned:</span>
          <b>{totalCleaned}</b>
        </div>
        <div className="summary-chip rate">
          <TrendingUp size={14} color="#10B981" />
          <span className="chip-label">Clearance Rate:</span>
          <b style={{ color: "#10B981" }}>{efficiency}%</b>
        </div>
      </div>

      <div className="chart-wrap-modern">
        {/* Y Axis Guide */}
        <div className="chart-y-modern">
          <span>{max}</span>
          <span>{Math.round(max * 0.66)}</span>
          <span>{Math.round(max * 0.33)}</span>
          <span>0</span>
        </div>

        {/* Main Chart Graphic Area */}
        <div className="chart-stage">
          {/* Reference Gridlines */}
          <div className="chart-gridline-layer">
            <div className="gridline at-100" />
            <div className="gridline at-66" />
            <div className="gridline at-33" />
            <div className="gridline at-0" />
          </div>

          {/* Bars Container */}
          <div className="bars-track-row">
            {data.map((val, i) => {
              const isHovered = hoveredIndex === i;
              const dHeight = Math.min(100, Math.max(8, (val.d / max) * 100));
              const cHeight = Math.min(100, Math.max(8, (val.c / max) * 100));
              const itemEff = Math.round((val.c / val.d) * 100);

              return (
                <div
                  key={i}
                  className={`bar-column-item ${isHovered ? "active-column" : ""}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Floating Cursor Hover Tooltip Popover */}
                  {isHovered && (
                    <div className="modern-chart-tooltip">
                      <div className="tooltip-title">{fullLabels ? fullLabels[i] : labels[i]}</div>
                      <div className="tooltip-row blue">
                        <span className="tooltip-dot blue" />
                        <span className="tooltip-label">Detected:</span>
                        <b className="tooltip-val">{val.d} items</b>
                      </div>
                      <div className="tooltip-row green">
                        <span className="tooltip-dot green" />
                        <span className="tooltip-label">Cleaned:</span>
                        <b className="tooltip-val">{val.c} items</b>
                      </div>
                      <div className="tooltip-footer">
                        <span>Clean Rate:</span>
                        <b style={{ color: itemEff >= 80 ? "#10B981" : "#3B82F6" }}>{itemEff}%</b>
                      </div>
                    </div>
                  )}

                  {/* Dual Bar Graphic */}
                  <div className="dual-bars-wrapper">
                    {/* Floating Value Badges above bars on hover */}
                    <div className="floating-bar-values">
                      <span className={`bar-val-badge blue ${isHovered ? "show" : ""}`}>
                        {val.d}
                      </span>
                      <span className={`bar-val-badge green ${isHovered ? "show" : ""}`}>
                        {val.c}
                      </span>
                    </div>

                    <div className="bar-pair-tracks">
                      {/* Detected Bar (Blue) */}
                      <div
                        className="bar-stem bar-detected"
                        style={{ height: `${dHeight}%` }}
                        title={`${labels[i]} Detected: ${val.d}`}
                      />
                      {/* Cleaned Bar (Mint Green) */}
                      <div
                        className="bar-stem bar-cleaned"
                        style={{ height: `${cHeight}%` }}
                        title={`${labels[i]} Cleaned: ${val.c}`}
                      />
                    </div>
                  </div>

                  {/* X Axis Label */}
                  <span className={`x-axis-label ${isHovered ? "label-active" : ""}`}>
                    {labels[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
