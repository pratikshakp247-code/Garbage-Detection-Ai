import { useState } from "react";
import {
  Calendar, ChevronDown, Download, Filter, MapPin, Plus, Search, Trash2, X
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
  // Double the detections to ensure pagination works
  const [historyItems, setHistoryItems] = useState([...detections, ...detections.map(d => ({...d, id: d.id + "_2"}))]);
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

  const handleDelete = (idToDelete) => {
    setHistoryItems(historyItems.filter(item => item.id !== idToDelete));
  };

  const filtered = historyItems.filter((item) => {
    const matchesQuery = `${item.location} ${item.type}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All statuses" || item.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statuses = ["All statuses", "Assigned", "Cleaned", "Pending"];

  return <div className="page-content">
      <div className="welcome-row">
        <div><div className="welcome-title">Detection history</div><div className="welcome-sub">Review, filter and manage every verified detection.</div></div>
        <div style={{display: "flex", gap: "12px"}}>
          <Button kind="primary" onClick={() => setIsAddModalOpen(true)}><Plus size={17} /> Add</Button>
          <Button kind="secondary" onClick={() => {
            const a = document.createElement("a");
            a.href = "data:text/csv;charset=utf-8,ID,Date,Location,Type\n1,May 25 2025,Riverside Park,Plastic";
            a.download = `History_Export_${Date.now()}.csv`;
            a.click();
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
            <Button kind="secondary" onClick={() => alert("Advanced filters (Date range, Confidence) coming soon!")}><Filter size={16} /> Filter</Button>
            
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
            <thead><tr><th>Date</th><th>Time</th><th>Location</th><th>Garbage type</th><th>Confidence</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {paginated.map((item) => <tr key={item.id}>
                <td><b>{item.date}</b></td>
                <td>{item.time}</td>
                <td><span className="location-cell"><MapPin size={14} /> {item.location}</span></td>
                <td><span className={`type-tag ${item.type.toLowerCase()}`}>{item.type}</span></td>
                <td><b>{item.confidence}</b></td>
                <td><span className={`status-tag ${item.status.toLowerCase()}`}><i />{item.status}</span></td>
                <td><button className="icon-button" style={{color: "var(--red)"}} onClick={() => handleDelete(item.id)}><Trash2 size={15} /></button></td>
              </tr>)}
              {paginated.length === 0 && <tr><td colSpan="7" style={{textAlign: "center", padding: "24px"}}>No records found.</td></tr>}
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
