import { useState } from "react";
import {
  Activity, AlertTriangle, Calendar, Camera, CheckCircle2, ChevronDown, Clock3,
  Leaf, MapPin, Radio, Recycle, ScanLine, Sparkles, Timer, Trash2,
  TrendingDown, TrendingUp, Wifi, XCircle
} from "lucide-react";
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import DetectionChart from '../components/DetectionChart.jsx';
import DonutChart from '../components/DonutChart.jsx';

const hotspotSamples = [
  { name: "Central District", zone: "Zone 01", count: 42, severity: "High" },
  { name: "Riverside Park", zone: "Zone 02", count: 31, severity: "High" },
  { name: "Market Street", zone: "Zone 03", count: 24, severity: "Medium" },
  { name: "North River", zone: "Zone 04", count: 14, severity: "Medium" },
  { name: "South End", zone: "Zone 05", count: 7, severity: "Low" },
];

const cleanupSamples = {
  Today: [8, 11, 7, 13, 10, 15, 12],
  "This week": [18, 23, 20, 28, 24, 32, 29],
  "This month": [48, 55, 51, 64, 60, 71, 68],
  "This year": [58, 63, 61, 72, 68, 79, 75],
};

const accuracySamples = [91, 92, 91, 94, 93, 96, 95];

export default function Analytics({ navigate }) {
  const [range, setRange] = useState("This week");
  const [activeCleanupBar, setActiveCleanupBar] = useState(null);
  const [activeAccuracyPoint, setActiveAccuracyPoint] = useState(null);
  
  const cycleRange = () => {
    const ranges = ["Today", "This week", "This month", "This year"];
    setRange(ranges[(ranges.indexOf(range) + 1) % ranges.length]);
  };

  const kpis = [
    { label: "Total Garbage", value: "1,248", trend: "4.2%", detail: "vs last week", direction: "up", tone: "bad", icon: Trash2 },
    { label: "Plastic Waste", value: "476", trend: "12%", detail: "vs last week", direction: "down", tone: "good", icon: Recycle },
    { label: "Organic Waste", value: "337", trend: "2.1%", detail: "vs last week", direction: "up", tone: "bad", icon: Leaf },
    { label: "Detection Accuracy", value: "94.8%", trend: "1.5%", detail: "Model v2.4 · updated yesterday", direction: "up", tone: "good", icon: ScanLine },
  ];
  const cleanupTrend = cleanupSamples[range];
  const peakCleanup = Math.max(...cleanupTrend);

  return <div className="page-content analytics-page">
      <div className="analytics-page-heading">
        <div>
          <h1>Waste Analytics</h1>
          <p>Detection trends and waste composition across municipal zones.</p>
        </div>
      </div>

      <section className="analytics-insight" aria-label="AI Insight">
        <div className="analytics-insight-icon"><Sparkles size={18} /></div>
        <div className="analytics-insight-copy">
          <div className="analytics-insight-label">AI Insight</div>
          <b>Plastic detections are down 12% in Riverside Park</b>
          <p>Cleanup interventions are having measurable impact. Consider extending the same route cadence to Market Street.</p>
        </div>
        <Button kind="secondary" className="analytics-route-button" onClick={() => alert("Applying route changes...")}>Apply to Route</Button>
      </section>

      <section className="analytics-kpis" aria-label="Waste summary">
        {kpis.map(({ label, value, trend, detail, direction, tone, icon: Icon }) => (
          <Card className="analytics-kpi" key={label}>
            <div className="analytics-kpi-heading">
              <div className="analytics-kpi-icon"><Icon size={17} /></div>
              <span>{label}</span>
            </div>
            <div className="analytics-kpi-value-row">
              <b>{value}</b>
              <span className={`analytics-kpi-trend ${tone}`}>
                {direction === "down" ? <TrendingDown size={14} /> : <TrendingUp size={14} />}{trend}
              </span>
            </div>
            <span className="analytics-kpi-detail">{detail}</span>
          </Card>
        ))}
      </section>

      <section className="analytics-chart-grid">
        <Card className="analytics-chart-card">
          <div className="analytics-section-heading">
            <div>
              <h2>Daily Detection Chart</h2>
              <p>Detected vs. cleaned items</p>
            </div>
            <button className="select-pill analytics-range-button" type="button" onClick={cycleRange} aria-label={`Change date range, currently ${range}`}>
              <Calendar size={14} /> {range} <ChevronDown size={14} />
            </button>
          </div>
          <div className="analytics-chart-legend" aria-label="Chart legend">
            <span><i className="detected" />Detected</span>
            <span><i className="cleaned" />Cleaned</span>
          </div>
          <DetectionChart range={range} compact />
        </Card>

        <Card className="analytics-chart-card analytics-composition">
          <div className="analytics-section-heading">
            <div>
              <h2>Waste Composition</h2>
              <p>By detected item count</p>
            </div>
          </div>
          <DonutChart compact />
        </Card>
      </section>

      <div className="analytics-sample-note"><span />Illustrative sample metrics only · not live operational telemetry</div>

      <section className="analytics-detail-section">
        <div className="analytics-detail-heading">
          <div><h2>Location-wise Waste Analysis</h2><p>Top waste hotspots and zone-level detection counts</p></div>
          <button type="button" className="analytics-map-action" onClick={() => navigate?.("Map")}><MapPin size={15} />View on Map</button>
        </div>
        <div className="analytics-hotspot-list">
          {hotspotSamples.map((spot, index) => <div className="analytics-hotspot-row" key={spot.zone}>
            <span className="analytics-hotspot-rank">{String(index + 1).padStart(2, "0")}</span>
            <div className="analytics-hotspot-name"><strong>{spot.name}</strong><span>{spot.zone}</span></div>
            <div className="analytics-hotspot-bar"><i style={{ width: `${(spot.count / hotspotSamples[0].count) * 100}%` }} /></div>
            <strong className="analytics-hotspot-count">{spot.count}</strong>
            <span className={`analytics-severity ${spot.severity.toLowerCase()}`}>{spot.severity}</span>
          </div>)}
        </div>
      </section>

      <section className="analytics-operations-grid">
        <article className="analytics-detail-card">
          <div className="analytics-detail-heading">
            <div><h2>Cleanup Performance</h2><p>Operational task summary</p></div>
            <Timer size={17} className="analytics-detail-icon" />
          </div>
          <div className="analytics-cleanup-stats">
            <div><span><Clock3 size={14} />Average cleanup</span><strong>1h 42m</strong></div>
            <div><span><Activity size={14} />Pending tasks</span><strong>150</strong></div>
            <div><span><AlertTriangle size={14} />Overdue tasks</span><strong className="critical">12</strong></div>
            <div><span><CheckCircle2 size={14} />Success rate</span><strong className="success">84.5%</strong></div>
          </div>
          <div className="analytics-mini-chart-title"><span>Cleanup completions</span><strong>{range}</strong></div>
          <div className="analytics-mini-bars" role="group" aria-label={`${range} cleanup completions sample chart`}>
            {cleanupTrend.map((value, index) => {
              const periodLabel = range === "Today" ? ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"][index] : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index];
              const tooltipId = `cleanup-tooltip-${index}`;
              return <button
                type="button"
                className="analytics-mini-bar-column"
                key={`${range}-${index}`}
                aria-label={`${periodLabel}: ${value} cleanup completions, sample data`}
                aria-describedby={activeCleanupBar === index ? tooltipId : undefined}
                onMouseEnter={() => setActiveCleanupBar(index)}
                onMouseLeave={event => { if (document.activeElement !== event.currentTarget) setActiveCleanupBar(null); }}
                onFocus={() => setActiveCleanupBar(index)}
                onBlur={() => setActiveCleanupBar(null)}
              >
                {activeCleanupBar === index && <span id={tooltipId} className="analytics-chart-value-tooltip" role="tooltip">{periodLabel}: <strong>{value}</strong> completions</span>}
                <span className="analytics-mini-bar" style={{ height: `${Math.max(12, (value / peakCleanup) * 100)}%` }} />
                <small>{range === "Today" ? ["8a", "10a", "12p", "2p", "4p", "6p", "8p"][index] : ["M", "T", "W", "T", "F", "S", "S"][index]}</small>
              </button>;
            })}
          </div>
        </article>

        <div className="analytics-model-device-stack">
          <article className="analytics-detail-card">
            <div className="analytics-detail-heading">
              <div><h2>AI Model Performance</h2><p>Detection quality indicators</p></div>
              <ScanLine size={17} className="analytics-detail-icon" />
            </div>
            <div className="analytics-model-stats">
              <div><span>Model accuracy</span><strong>94.8%</strong></div>
              <div><span>Avg. confidence</span><strong>93.2%</strong></div>
              <div><span>False detections</span><strong className="critical">40</strong></div>
            </div>
            <div className="analytics-accuracy-trend" role="group" aria-label="Sample model accuracy trend over seven periods">
              {accuracySamples.map((value, index) => {
                const period = `Period ${index + 1}`;
                const tooltipId = `accuracy-tooltip-${index}`;
                return <button
                  type="button"
                  className="analytics-accuracy-point"
                  key={index}
                  aria-label={`${period}: ${value}% model accuracy, sample data`}
                  aria-describedby={activeAccuracyPoint === index ? tooltipId : undefined}
                  onMouseEnter={() => setActiveAccuracyPoint(index)}
                  onMouseLeave={event => { if (document.activeElement !== event.currentTarget) setActiveAccuracyPoint(null); }}
                  onFocus={() => setActiveAccuracyPoint(index)}
                  onBlur={() => setActiveAccuracyPoint(null)}
                >
                  {activeAccuracyPoint === index && <span id={tooltipId} className="analytics-chart-value-tooltip" role="tooltip">{period}: <strong>{value}%</strong> accuracy</span>}
                  <span className="analytics-accuracy-dot" style={{ bottom: `${((value - 88) / 10) * 100}%` }} />
                  <small>{`P${index + 1}`}</small>
                </button>;
              })}
            </div>
          </article>

          <article className="analytics-detail-card analytics-iot-card">
            <div className="analytics-detail-heading">
              <div><h2>IoT Network Health</h2><p>Device health snapshot</p></div>
              <Wifi size={17} className="analytics-detail-icon" />
            </div>
            <div className="analytics-iot-grid">
              <div><Camera size={15} /><span>Connected cameras</span><strong>23 / 24</strong></div>
              <div><XCircle size={15} className="critical" /><span>Offline cameras</span><strong className="critical">1</strong></div>
              <div><Radio size={15} /><span>Active sensors</span><strong>48</strong></div>
              <div><AlertTriangle size={15} className="warning" /><span>Device alerts</span><strong className="warning">2</strong></div>
            </div>
            <div className="analytics-last-data"><span>Last data received</span><strong>2 min ago</strong></div>
          </article>
        </div>
      </section>

    </div>;
}
