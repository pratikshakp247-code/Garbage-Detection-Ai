import { useState } from "react";
import {
  Calendar, ChevronDown, Sparkles, TrendingUp, TrendingDown
} from "lucide-react";
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import DetectionChart from '../components/DetectionChart.jsx';
import DonutChart from '../components/DonutChart.jsx';

export default function Analytics({ navigate }) {
  const [range, setRange] = useState("Last 7 Days");
  
  const cycleRange = () => {
    const ranges = ["Last 7 Days", "Last 30 Days", "This Year", "All Time"];
    setRange(ranges[(ranges.indexOf(range) + 1) % ranges.length]);
  };

  return <div className="page-content">
      <div className="analytics-banner compact" style={{cursor: 'pointer', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', background: 'var(--surface)', border: '1px solid var(--primary-soft)', borderRadius: '12px', marginBottom: '16px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <div style={{width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px'}}>AI Insight</div>
            <b style={{fontSize: '13px', color: 'var(--ink)'}}>Plastic detections are down 12% in Riverside Park</b>
            <div style={{fontSize: '14px', color: 'var(--muted)', marginTop: '2px'}}>Cleanup interventions are having measurable impact. Consider extending the same route cadence to Market Street.</div>
          </div>
        </div>
        <Button kind="secondary" style={{whiteSpace: 'nowrap', padding: '8px 14px', fontSize: '14px'}} onClick={() => alert("Applying route changes...")}>Apply to Route</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
        <Card style={{padding: '20px'}}>
          <div style={{fontSize: '13px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase'}}>Total Garbage</div>
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '8px'}}>
            <b style={{fontSize: '24px', color: 'var(--ink)'}}>1,248</b>
            <span style={{fontSize: '13px', color: 'var(--red)', fontWeight: 'bold', display: 'flex', alignItems: 'center'}}><TrendingUp size={12} style={{marginRight: '2px'}}/> 4.2%</span>
          </div>
          <div style={{fontSize: '13px', color: 'var(--muted)', marginTop: '4px'}}>vs last week</div>
        </Card>
        <Card style={{padding: '20px'}}>
          <div style={{fontSize: '13px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase'}}>Plastic Waste</div>
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '8px'}}>
            <b style={{fontSize: '24px', color: 'var(--ink)'}}>476</b>
            <span style={{fontSize: '13px', color: 'var(--green)', fontWeight: 'bold', display: 'flex', alignItems: 'center'}}><TrendingDown size={12} style={{marginRight: '2px'}}/> 12%</span>
          </div>
          <div style={{fontSize: '13px', color: 'var(--muted)', marginTop: '4px'}}>vs last week</div>
        </Card>
        <Card style={{padding: '20px'}}>
          <div style={{fontSize: '13px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase'}}>Organic Waste</div>
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '8px'}}>
            <b style={{fontSize: '24px', color: 'var(--ink)'}}>337</b>
            <span style={{fontSize: '13px', color: 'var(--red)', fontWeight: 'bold', display: 'flex', alignItems: 'center'}}><TrendingUp size={12} style={{marginRight: '2px'}}/> 2.1%</span>
          </div>
          <div style={{fontSize: '13px', color: 'var(--muted)', marginTop: '4px'}}>vs last week</div>
        </Card>
        <Card style={{padding: '20px'}}>
          <div style={{fontSize: '13px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase'}}>Detection Accuracy</div>
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '8px'}}>
            <b style={{fontSize: '24px', color: 'var(--ink)'}}>94.8%</b>
            <span style={{fontSize: '13px', color: 'var(--green)', fontWeight: 'bold', display: 'flex', alignItems: 'center'}}><TrendingUp size={12} style={{marginRight: '2px'}}/> 1.5%</span>
          </div>
          <div style={{fontSize: '13px', color: 'var(--muted)', marginTop: '4px'}}>Model v2.4 (Updated yesterday)</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Card style={{padding: '24px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
            <div>
              <div style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--ink)'}}>Daily Detection Chart</div>
              <div style={{fontSize: '13px', color: 'var(--muted)', marginTop: '2px'}}>Detected vs Cleaned</div>
            </div>
            <div className="select-pill" style={{cursor: 'pointer'}} onClick={cycleRange}><Calendar size={12}/> {range} <ChevronDown size={12} /></div>
          </div>
          <DetectionChart timeRange={range} compact />
        </Card>
        <Card style={{padding: '24px', display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
            <div>
              <div style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--ink)'}}>Waste Composition</div>
              <div style={{fontSize: '13px', color: 'var(--muted)', marginTop: '2px'}}>By detected item count</div>
            </div>
            <span style={{fontSize: '13px', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer'}}>View all categories</span>
          </div>
          <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
             <DonutChart compact={true} />
          </div>
        </Card>
      </div>

    </div>;
}
