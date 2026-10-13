import { useState } from "react";
import { ArrowRight, Sparkles, Layers } from "lucide-react";

export default function DonutChart({ compact = false }) {
  const [showAll, setShowAll] = useState(false);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const total = 1248;
  const categories = [
    { name: "Plastic Waste", desc: "bottles, bags, wrappers", count: 476, color: "#3B82F6" },
    { name: "Organic Waste", desc: "food waste, leaves, vegetable waste", count: 337, color: "#10B981" },
    { name: "Paper & Cardboard", desc: "paper, newspapers, boxes", count: 160, color: "#F59E0B" },
    { name: "Glass", desc: "bottles, glass containers", count: 90, color: "#60A5FA" },
    { name: "Metal", desc: "cans, metal scraps", count: 55, color: "#8B5CF6" },
    { name: "Medical Waste", desc: "masks, gloves, medical materials", count: 40, color: "#EF4444" },
    { name: "Textile Waste", desc: "clothes, fabric", count: 30, color: "#EC4899" },
    { name: "E-Waste", desc: "wires, electronics, batteries", count: 25, color: "#06B6D4" },
    { name: "Hazardous Waste", desc: "chemicals, paints, etc.", count: 20, color: "#F97316" },
    { name: "Mixed / Black Bag Waste", desc: "mixed household waste", count: 15, color: "#64748B" },
  ];

  const top5 = categories.slice(0, 5);
  const otherSum = categories.slice(5).reduce((acc, cat) => acc + cat.count, 0);
  
  const chartSlices = [
    ...top5,
    { name: "Other Waste", desc: "Medical, e-waste, textile, hazardous", count: otherSum, color: "#94A3B8" }
  ];
  
  let cumulativePercent = 0;
  const svgSlices = chartSlices.map(slice => {
    const percent = slice.count / total;
    if (percent === 0) return { ...slice, path: "", percent };
    
    if (percent >= 1) {
      return { ...slice, path: "M 1 0 A 1 1 0 1 1 -1 0 A 1 1 0 1 1 1 0 Z", percent };
    }

    const startX = Math.cos(2 * Math.PI * (cumulativePercent - 0.25));
    const startY = Math.sin(2 * Math.PI * (cumulativePercent - 0.25));
    cumulativePercent += percent;
    const endX = Math.cos(2 * Math.PI * (cumulativePercent - 0.25));
    const endY = Math.sin(2 * Math.PI * (cumulativePercent - 0.25));
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    const path = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
    
    return { ...slice, path, percent };
  });

  const displayList = showAll ? categories : top5;

  return (
    <div className={`donut-wrap ${compact ? "compact" : ""}`}>
      {/* Interactive Donut Graphic */}
      <div className="donut-visual-container">
        {/* Floating Tooltip when cursor is over a slice */}
        {hoveredSlice && (
          <div className="donut-floating-tooltip">
            <div className="tooltip-head-row">
              <span className="tooltip-color-dot" style={{ background: hoveredSlice.color }} />
              <b className="tooltip-cat-name">{hoveredSlice.name}</b>
            </div>
            <div className="tooltip-values-row">
              <span className="tooltip-count">{hoveredSlice.count.toLocaleString()} items</span>
              <span className="tooltip-pill" style={{ background: `${hoveredSlice.color}25`, color: hoveredSlice.color }}>
                {((hoveredSlice.count / total) * 100).toFixed(1)}%
              </span>
            </div>
            {hoveredSlice.desc && (
              <div className="tooltip-desc-text">{hoveredSlice.desc}</div>
            )}
          </div>
        )}

        <div className="donut interactive-donut">
          <svg
            viewBox="-1.1 -1.1 2.2 2.2"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'visible'
            }}
          >
            {svgSlices.map((slice) => {
              const isSelected = hoveredSlice?.name === slice.name;
              const isDimmed = hoveredSlice && !isSelected;

              return (
                <path
                  key={slice.name}
                  d={slice.path}
                  fill={slice.color}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? "0.03" : "0.015"}
                  style={{
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                    transformOrigin: '0 0',
                    opacity: isDimmed ? 0.45 : 1,
                    filter: isSelected ? `drop-shadow(0 4px 10px ${slice.color}66)` : 'none',
                    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={() => setHoveredSlice(slice)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              );
            })}
          </svg>

          {/* Dynamic Center Hole Display */}
          <div className="donut-center-circle">
            {hoveredSlice ? (
              <div className="donut-center-hovered">
                <b style={{ color: hoveredSlice.color, fontSize: '21px', lineHeight: 1.1 }}>
                  {hoveredSlice.count.toLocaleString()}
                </b>
                <span className="center-pct" style={{ color: hoveredSlice.color }}>
                  {((hoveredSlice.count / total) * 100).toFixed(1)}%
                </span>
                <span className="center-cat">
                  {hoveredSlice.name.split(" ")[0]}
                </span>
              </div>
            ) : (
              <div className="donut-center-default">
                <b>{total.toLocaleString()}</b>
                <span>Total</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend with Interactive Hover */}
      <div className="legend">
        {displayList.map((cat) => {
          const percent = ((cat.count / total) * 100).toFixed(1);
          const isSelected = hoveredSlice?.name === cat.name;

          return (
            <div
              className={`legend-row interactive-legend-row ${isSelected ? "active-row" : ""}`}
              key={cat.name}
              onMouseEnter={() => setHoveredSlice(cat)}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <span className="legend-dot" style={{ background: cat.color }} />
              <div className="legend-info">
                <span className="legend-name">{cat.name}</span>
                <span className="legend-desc">{cat.desc}</span>
              </div>
              <div className="legend-stats">
                <span className="legend-count">{cat.count}</span>
                <b className="legend-pct">{percent}%</b>
              </div>
            </div>
          );
        })}

        {!showAll ? (
          <button
            className="text-button"
            onClick={() => setShowAll(true)}
            style={{ marginTop: "8px", alignSelf: "flex-start", fontSize: '13.5px' }}
          >
            View all categories ({categories.length}) <ArrowRight size={14} />
          </button>
        ) : (
          <button
            className="text-button"
            onClick={() => setShowAll(false)}
            style={{ marginTop: "8px", alignSelf: "flex-start", fontSize: '13.5px' }}
          >
            Show top categories
          </button>
        )}
      </div>
    </div>
  );
}
