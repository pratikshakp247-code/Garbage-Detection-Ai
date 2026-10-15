import { useState } from "react";
import {
  Calendar, ChevronDown, Download, Eye, Filter, MapPin, Plus, Search, Trash2, X
} from "lucide-react";
import { detections } from "../data/constants.js";
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { useLocation } from "react-router-dom";

export default function HistoryPage({ initialQuery = "", initialStatus = "All statuses" }) {
  const location = useLocation();
  const state = location.state || {};
  const [query, setQuery] = useState(state.filter || initialQuery);
  const [statusFilter, setStatusFilter] = useState(state.status || initialStatus);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  // Double the detections to ensure pagination works
  const [historyItems, setHistoryItems] = useState([...detections, ...detections.map(d => ({...d, id: d.id + "_2"}))]);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newType, setNewType] = useState("Plastic");
  const [newLocation, setNewLocation] = useState("Riverside Park");

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: "d" + Date.now() + Math.random(),
      date: "May 25, 2025",
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
      location: newLocation,
      type: newType,
      confidence: Math.floor(Math.random() * (99 - 80) + 80) + "%",
      status: "Pending"
    };
    setHistoryItems([newItem, ...historyItems]);
    setIsAddModalOpen(false);
  };

  const handleDelete = (itemToDelete) => {
    if (!window.confirm(`Delete detection ${itemToDelete.id}? This action cannot be undone.`)) return;

    setHistoryItems(items => items.filter(item => item.id !== itemToDelete.id));
    if (currentPage > 1 && filtered.length - 1 <= (currentPage - 1) * itemsPerPage) {
      setCurrentPage(page => Math.max(1, page - 1));
    }
    if (selectedDetection?.id === itemToDelete.id) setSelectedDetection(null);
  };

  const filtered = historyItems.filter((item) => {
    const matchesQuery = `${item.location} ${item.type}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All statuses" || item.status === statusFilter;
    const parsedDate = new Date(item.date);
    const itemDate = Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString().slice(0, 10);
    const matchesFromDate = !fromDate || (itemDate && itemDate >= fromDate);
    const matchesToDate = !toDate || (itemDate && itemDate <= toDate);
    const matchesCategory = categoryFilter === "All categories" || item.type === categoryFilter;
    return matchesQuery && matchesStatus && matchesFromDate && matchesToDate && matchesCategory;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statuses = ["All statuses", "Assigned", "Cleaned", "Pending"];
  const categories = [...new Set(historyItems.map(item => item.type).filter(Boolean))].sort();
  const activeFilterCount = [fromDate, toDate, categoryFilter !== "All categories"].filter(Boolean).length;

  return <div className="page-content">
      <div className="welcome-row">
        <div><div className="welcome-title">Detection history</div><div className="welcome-sub">Review, filter and manage every verified detection.</div></div>
        <div style={{display: "flex", gap: "12px"}}>
          <Button kind="primary" onClick={() => setIsAddModalOpen(true)}><Plus size={17} /> Add</Button>
          <Button kind="secondary" onClick={() => {
            const csvRows = filtered.map(item => [item.id, item.date, item.time, item.location, item.type, item.confidence, item.status]
              .map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","));
            const a = document.createElement("a");
            const csvUrl = URL.createObjectURL(new Blob([["Detection ID", "Date", "Time", "Location", "Garbage Type", "Confidence", "Status"].join(","), ...csvRows].join("\r\n"), { type: "text/csv;charset=utf-8" }));
            a.href = csvUrl;
            a.download = `History_Export_${Date.now()}.csv`;
            a.click();
            window.setTimeout(() => URL.revokeObjectURL(csvUrl), 1000);
          }}><Download size={17} /> Export CSV</Button>
        </div>
      </div>
      <Card>
        <div className="table-toolbar">
          <div className="search-box table-search">
            <Search size={17} />
            <input placeholder="Search by location or type..." value={query} onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }} />
          </div>
          <div style={{display: "flex", gap: "12px", alignItems: "center"}}>
            <div style={{position: "relative"}}>
              <Button kind="secondary" onClick={() => setShowFilterPanel(open => !open)} aria-expanded={showFilterPanel}>
                <Filter size={16} /> Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </Button>
              {showFilterPanel && (
                <div style={{position: "absolute", top: "calc(100% + 8px)", right: 0, width: "min(300px, calc(100vw - 36px))", padding: "16px", border: "1px solid var(--line)", borderRadius: "12px", background: "var(--surface)", boxShadow: "0 8px 24px rgba(0,0,0,0.14)", zIndex: 50, display: "grid", gap: "12px"}}>
                  <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <strong style={{fontSize: "14px", color: "var(--ink)"}}>Filter detections</strong>
                    <button type="button" className="text-button" onClick={() => { setFromDate(""); setToDate(""); setCategoryFilter("All categories"); setCurrentPage(1); }}>Clear</button>
                  </div>
                  <label style={{display: "grid", gap: "5px", fontSize: "12px", fontWeight: 600, color: "var(--muted)"}}>
                    From date
                    <input type="date" value={fromDate} max={toDate || undefined} onChange={e => { setFromDate(e.target.value); setCurrentPage(1); }} style={{width: "100%", minWidth: 0, padding: "9px 10px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--surface)", color: "var(--ink)"}} />
                  </label>
                  <label style={{display: "grid", gap: "5px", fontSize: "12px", fontWeight: 600, color: "var(--muted)"}}>
                    To date
                    <input type="date" value={toDate} min={fromDate || undefined} onChange={e => { setToDate(e.target.value); setCurrentPage(1); }} style={{width: "100%", minWidth: 0, padding: "9px 10px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--surface)", color: "var(--ink)"}} />
                  </label>
                  <label style={{display: "grid", gap: "5px", fontSize: "12px", fontWeight: 600, color: "var(--muted)"}}>
                    Garbage category
                    <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }} style={{width: "100%", padding: "9px 10px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--surface)", color: "var(--ink)"}}>
                      <option>All categories</option>
                      {categories.map(category => <option key={category}>{category}</option>)}
                    </select>
                  </label>
                </div>
              )}
            </div>
            
            <div style={{position: 'relative'}}>
               <div className="select-pill" style={{cursor: "pointer", userSelect: "none"}} onClick={() => setShowStatusMenu(!showStatusMenu)}>
                  {statusFilter} <ChevronDown size={14} />
               </div>
               {showStatusMenu && (
                 <div style={{position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 50, minWidth: '160px'}}>
                   {statuses.map(s => (
                     <button key={s} className="dropdown-item" onClick={() => { setStatusFilter(s); setShowStatusMenu(false); setCurrentPage(1); }}>
                       {s}
                     </button>
                   ))}
                 </div>
               )}
            </div>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>S.No.</th><th>Date</th><th>Time</th><th>Location</th><th>Garbage type</th><th>Confidence</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {paginated.map((item, index) => <tr key={item.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td><b>{item.date}</b></td>
                <td>{item.time}</td>
                <td><span className="location-cell"><MapPin size={14} /> {item.location}</span></td>
                <td><span className={`type-tag ${item.type.toLowerCase()}`}>{item.type}</span></td>
                <td><b>{item.confidence}</b></td>
                <td><span className={`status-tag ${item.status.toLowerCase()}`}><i />{item.status}</span></td>
                <td><div style={{display: "flex", gap: "8px"}}>
                  <button type="button" className="icon-button" title={`View detection ${item.id}`} aria-label={`View detection ${item.id}`} style={{color: "var(--primary)"}} onClick={() => setSelectedDetection(item)}><Eye size={16} /></button>
                  <button type="button" className="icon-button" title={`Delete detection ${item.id}`} aria-label={`Delete detection ${item.id}`} style={{color: "var(--red)"}} onClick={() => handleDelete(item)}><Trash2 size={15} /></button>
                </div></td>
              </tr>)}
              {paginated.length === 0 && <tr><td colSpan="8" style={{textAlign: "center", padding: "24px"}}>No records found.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} detections</span>
          <div style={{display: "flex", gap: "8px"}}>
            <Button kind="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
            <Button kind="secondary" disabled={currentPage >= totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>

      {selectedDetection && (
        <div role="presentation" onClick={() => setSelectedDetection(null)} style={{position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.48)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"}}>
          <section role="dialog" aria-modal="true" aria-labelledby="detection-detail-title" onClick={e => e.stopPropagation()} style={{width: "min(640px, 100%)", maxHeight: "90vh", overflowY: "auto", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "14px", boxShadow: "0 20px 50px rgba(0,0,0,0.25)", color: "var(--ink)"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "18px 20px", borderBottom: "1px solid var(--line)"}}>
              <div>
                <h2 id="detection-detail-title" style={{margin: 0, fontSize: "18px"}}>{selectedDetection.type} detection</h2>
                <span style={{fontSize: "12px", color: "var(--muted)"}}>Complete detection record</span>
              </div>
              <button type="button" className="icon-button" title="Close details" aria-label="Close details" onClick={() => setSelectedDetection(null)}><X size={17} /></button>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", padding: "20px"}}>
              {[
                ["Detection ID", selectedDetection.id],
                ["Date", selectedDetection.date],
                ["Time", selectedDetection.time],
                ["Location", selectedDetection.location],
                ["Garbage Type", selectedDetection.type],
                ["Confidence", selectedDetection.confidence],
                ["Status", selectedDetection.status],
              ].map(([label, value]) => <div key={label}>
                <div style={{fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px"}}>{label}</div>
                <div style={{fontSize: "14px", fontWeight: 600, overflowWrap: "anywhere"}}>{value || "Not available"}</div>
              </div>)}
            </div>
            <div style={{padding: "0 20px 20px"}}>
              <div style={{fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "8px"}}>Detection Image</div>
              {selectedDetection.image || selectedDetection.imageUrl ? (
                <img src={selectedDetection.image || selectedDetection.imageUrl} alt={`${selectedDetection.type} detected at ${selectedDetection.location}`} style={{display: "block", maxWidth: "100%", maxHeight: "320px", objectFit: "contain", borderRadius: "10px", border: "1px solid var(--line)"}} />
              ) : (
                <div style={{padding: "24px", border: "1px dashed var(--line)", borderRadius: "10px", color: "var(--muted)", textAlign: "center", fontSize: "13px"}}>No image available for this detection.</div>
              )}
            </div>
          </section>
        </div>
      )}
      
      {isAddModalOpen && (
        <div style={{position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center"}}>
          <div style={{background: "var(--surface)", padding: "24px", borderRadius: "12px", width: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", color: "var(--ink)"}}>
            <h3 style={{marginBottom: "16px", fontSize: "16px"}}>Add Detection</h3>
            <form onSubmit={handleAddSubmit}>
              <div style={{marginBottom: "16px"}}>
                <label style={{display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--muted)", fontWeight: "bold"}}>Garbage Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value)} style={{width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)"}}>
                  <option>Plastic</option>
                  <option>Organic</option>
                  <option>Paper</option>
                  <option>Glass</option>
                  <option>Metal</option>
                </select>
              </div>
              <div style={{marginBottom: "24px"}}>
                <label style={{display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--muted)", fontWeight: "bold"}}>Location</label>
                <input value={newLocation} onChange={e => setNewLocation(e.target.value)} style={{width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)"}} />
              </div>
              <div style={{display: "flex", gap: "12px", justifyContent: "flex-end"}}>
                <Button kind="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button kind="primary" type="submit">Add Record</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>;
}
