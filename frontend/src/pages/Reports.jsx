import { useMemo, useState } from "react";
import {
  Activity, BarChart3, CalendarDays, CheckCircle2,
  ChevronDown, Download, Eye, FileBarChart, Filter, Focus, MapPin, Printer,
  Recycle, Search, ShieldCheck, Trash2, TrendingUp, Wifi, X, Zap
} from "lucide-react";
import { detections } from "../data/constants.js";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import DetectionChart from "../components/DetectionChart.jsx";

const itemsPerPage = 3;
const reportPeriods = ["Daily", "Weekly", "Monthly"];
const reportTypes = ["Complete Report", "Detection Activity", "Cleanup Operations", "Waste Composition", "Location Summary", "AI & IoT Status"];
const chartRanges = { Daily: "Today", Weekly: "This week", Monthly: "This month" };
const categoryBreakdown = [
  { name: "Plastic", count: 476, share: 38, tone: "blue" },
  { name: "Organic", count: 337, share: 27, tone: "green" },
  { name: "Paper", count: 225, share: 18, tone: "navy" },
  { name: "Glass", count: 112, share: 9, tone: "teal" },
  { name: "Metal", count: 98, share: 8, tone: "amber" },
];
const locationBreakdown = [
  { name: "Central District", count: 450 },
  { name: "Riverside Park", count: 320 },
  { name: "North River", count: 210 },
  { name: "Market Street", count: 180 },
  { name: "South End", count: 88 },
];
const workflow = [
  { name: "Detected", count: 1248, tone: "navy" },
  { name: "Reported", count: 1100, tone: "blue" },
  { name: "Assigned", count: 950, tone: "blue" },
  { name: "Cleaning in Progress", count: 420, tone: "amber" },
  { name: "Cleaned", count: 500, tone: "green" },
  { name: "Pending", count: 150, tone: "red" },
];
const reportStats = [
  { label: "Total Detections", value: "386", indicator: "14.2%", detail: "vs previous period", icon: Focus, tone: "blue", direction: "up", indicatorTone: "neutral" },
  { label: "Most Detected", value: "Plastic", indicator: "38% share", detail: "of recorded waste", icon: Recycle, tone: "teal", indicatorTone: "neutral" },
  { label: "Model Accuracy", value: "96.8%", indicator: "1.4%", detail: "vs previous period", icon: Zap, tone: "green", direction: "up", indicatorTone: "positive" },
  { label: "Cleanup Rate", value: "84.5%", indicator: "6.8%", detail: "vs previous period", icon: CheckCircle2, tone: "navy", direction: "up", indicatorTone: "positive" },
];

const parseReportDate = report => {
  const date = new Date(report.date);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = date => date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const filterByPeriod = (rows, period) => {
  const datedRows = rows.map(report => ({ report, date: parseReportDate(report) })).filter(entry => entry.date);
  if (!datedRows.length) return [];
  const latestDate = new Date(Math.max(...datedRows.map(entry => entry.date.getTime())));
  return datedRows.filter(({ date }) => {
    if (period === "Daily") return date.toDateString() === latestDate.toDateString();
    if (period === "Monthly") return date.getFullYear() === latestDate.getFullYear() && date.getMonth() === latestDate.getMonth();
    const earliestDate = new Date(latestDate);
    earliestDate.setDate(earliestDate.getDate() - 6);
    return date >= earliestDate && date <= latestDate;
  }).map(entry => entry.report);
};

const escapeCsvValue = value => `"${String(value ?? "").replace(/"/g, '""')}"`;

const getReportExportData = (reportType, reports) => {
  if (reportType === "Waste Composition") {
    return { headers: ["Garbage Category", "Detected Items", "Share"], rows: categoryBreakdown.map(item => [item.name, item.count, `${item.share}%`]) };
  }
  if (reportType === "Location Summary") {
    return { headers: ["Location", "Detections"], rows: locationBreakdown.map(item => [item.name, item.count]) };
  }
  if (reportType === "Cleanup Operations") {
    return { headers: ["Workflow Stage", "Records"], rows: workflow.map(item => [item.name, item.count]) };
  }
  if (reportType === "AI & IoT Status") {
    return { headers: ["Metric", "Value"], rows: [["Model accuracy", "96.8%"], ["Average confidence", "93.2%"], ["Correct detections", "1,208"], ["False detections", "40"], ["Connected cameras", "24"], ["Online cameras", "23"], ["Offline cameras", "1"], ["Active sensors", "48"], ["Sensor alerts", "2"]] };
  }
  return {
    headers: ["S.No.", "Report ID", "Date", "Location", "Garbage Type", "Quantity", "Status"],
    rows: reports.map((report, index) => [index + 1, report.id, report.date, report.location, report.type, report.quantity || "", report.status]),
  };
};

const downloadCsv = (data, filename) => {
  const csvRows = [data.headers, ...data.rows].map(row => row.map(escapeCsvValue).join(","));
  const blob = new Blob([csvRows.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const downloadPdf = (data, period, reportType) => {
  const lines = [
    "GarbageDetect AI - Municipal Waste Report",
    `Report type: ${reportType}`,
    `Reporting period: ${period}`,
    `Records included: ${data.rows.length}`,
    "",
    data.headers.join(" | "),
    ...data.rows.map(row => row.join(" | ")),
  ].map(line => line.replace(/[^\x20-\x7E]/g, " "));
  const escapePdf = text => text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const textStream = `BT\n/F1 10 Tf\n50 790 Td\n14 TL\n${lines.map((line, index) => `${index ? "T*\n" : ""}(${escapePdf(line)}) Tj`).join("\n")}\nET`;
  const objects = [
    "<</Type /Catalog /Pages 2 0 R>>",
    "<</Type /Pages /Kids [3 0 R] /Count 1>>",
    "<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources <</Font <</F1 4 0 R>>>> /Contents 5 0 R>>",
    "<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>",
    `<</Length ${textStream.length}>>\nstream\n${textStream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
  pdf += `trailer\n<</Size ${offsets.length} /Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `GarbageDetect_${reportType.replace(/[^a-z0-9]+/gi, "_")}_${period}.pdf`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default function Reports() {
  const [range, setRange] = useState("Weekly");
  const [reportType, setReportType] = useState("Complete Report");
  const [reports, setReports] = useState(() => detections.map(report => ({ ...report, quantity: report.quantity || "" })));
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const periodReports = useMemo(() => filterByPeriod(reports, range), [reports, range]);
  const visibleReports = useMemo(() => periodReports.filter(report => {
    const searchText = `${report.id} ${report.location} ${report.type} ${report.status}`.toLowerCase();
    return searchText.includes(query.toLowerCase().trim()) &&
      (categoryFilter === "All types" || report.type === categoryFilter) &&
      (statusFilter === "All statuses" || report.status === statusFilter);
  }), [periodReports, query, categoryFilter, statusFilter]);
  const totalPages = Math.ceil(visibleReports.length / itemsPerPage);
  const pageReports = visibleReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const exportData = useMemo(() => getReportExportData(reportType, visibleReports), [reportType, visibleReports]);
  const showAllSections = reportType === "Complete Report";
  const showPerformance = showAllSections || reportType === "Detection Activity";
  const showReportSummary = showAllSections || reportType === "Detection Activity";
  const showCategoryBreakdown = showAllSections || reportType === "Waste Composition";
  const showLocationSummary = showAllSections || reportType === "Location Summary";
  const showCleanupWorkflow = showAllSections || reportType === "Cleanup Operations";
  const showSystemStatus = showAllSections || reportType === "AI & IoT Status";
  const showRecentReports = showAllSections || reportType === "Detection Activity" || reportType === "Cleanup Operations";
  const categories = [...new Set(reports.map(report => report.type))].sort();
  const statuses = [...new Set(reports.map(report => report.status))].sort();
  const periodDates = periodReports.map(parseReportDate).filter(Boolean).sort((a, b) => a - b);
  const periodLabel = periodDates.length
    ? `${formatDate(periodDates[0])} to ${formatDate(periodDates[periodDates.length - 1])}`
    : "No dates in this period";

  const handleRangeChange = period => {
    setRange(period);
    setCurrentPage(1);
  };

  const handleDelete = () => {
    if (!pendingDelete) return;
    setReports(current => current.filter(report => report.id !== pendingDelete.id));
    if (selectedReport?.id === pendingDelete.id) setSelectedReport(null);
    setPendingDelete(null);
    setCurrentPage(page => Math.min(page, Math.max(1, Math.ceil((visibleReports.length - 1) / itemsPerPage))));
  };

  const handlePrint = () => window.print();

  return (
    <div className="page-content reports-page">
      <div className="reports-page-heading">
        <div>
          <h1>Reports</h1>
          <p>Municipal waste detection and cleanup performance.</p>
        </div>
        <div className="reports-period-stamp"><CalendarDays size={15} />{periodLabel}</div>
      </div>

      <section className="reports-banner">
        <div className="reports-banner-copy">
          <div className="reports-banner-icon"><FileBarChart size={18} /></div>
          <div><strong>{reportType}</strong><span>{range} operational report · {periodReports.length} records</span></div>
        </div>
        <div className="reports-banner-actions">
          <Button onClick={() => downloadPdf(exportData, range, reportType)}><Download size={15} />Download PDF</Button>
          <Button kind="secondary" onClick={() => downloadCsv(exportData, `GarbageDetect_${reportType.replace(/[^a-z0-9]+/gi, "_")}_${range}.csv`)}><Download size={15} />Export CSV</Button>
          <Button kind="secondary" onClick={handlePrint}><Printer size={15} />Print Report</Button>
        </div>
      </section>

      <div className="reports-range-row">
        <div className="range-tabs reports-range-tabs" role="tablist" aria-label="Reporting period">
          {reportPeriods.map(period => <button key={period} type="button" role="tab" aria-selected={range === period} className={range === period ? "active" : ""} onClick={() => handleRangeChange(period)}>{period}</button>)}
        </div>
        <div className="reports-range-meta">
          <span className="reports-record-count">{periodReports.length} records in selected period</span>
          <label className="reports-type-picker"><span>Report type</span><select aria-label="Choose report type" value={reportType} onChange={event => { setReportType(event.target.value); setCurrentPage(1); }}>{reportTypes.map(type => <option key={type}>{type}</option>)}</select><ChevronDown size={14} /></label>
        </div>
      </div>

      <section className="reports-kpis" aria-label="Report summary metrics">
        {reportStats.map(({ label, value, indicator, detail, icon: Icon, tone, direction, indicatorTone }) => (
          <Card key={label} className="reports-kpi">
            <div className="reports-kpi-top"><span>{label}</span><i className={`reports-kpi-icon ${tone}`}><Icon size={17} /></i></div>
            <div className="reports-kpi-main"><strong>{value}</strong><span className={indicatorTone}>{direction === "up" && <TrendingUp size={13} />}{indicator}</span></div>
            <small>{detail}</small>
          </Card>
        ))}
      </section>

      {(showPerformance || showReportSummary) && <section className={`reports-grid-two ${showPerformance !== showReportSummary ? "reports-single-panel" : ""}`}>
        {showPerformance && <Card className="reports-panel reports-performance-panel">
          <div className="reports-panel-heading"><div><h2>{range} Performance</h2><p>Detections and resolved cleanup tasks</p></div><span className="reports-period-chip">{range}</span></div>
          <div className="reports-chart-legend"><span><i className="detected" />Detected</span><span><i className="cleaned" />Cleaned</span></div>
          <DetectionChart range={chartRanges[range]} />
        </Card>}
        {showReportSummary && <Card className="reports-panel">
          <div className="reports-panel-heading"><div><h2>Report Summary</h2><p>{periodLabel}</p></div><span className="reports-summary-icon"><BarChart3 size={17} /></span></div>
          <div className="reports-summary-list">
            <div><span>Peak detection day</span><strong>Saturday</strong></div>
            <div><span>Busiest zone</span><strong>Central District</strong></div>
            <div><span>Average response</span><strong>1h 42m</strong></div>
            <div><span>Waste diverted</span><strong>1.8 tons</strong></div>
          </div>
          <Button className="reports-summary-action" kind="secondary" onClick={() => downloadPdf(exportData, range, reportType)}><FileBarChart size={15} />Download summary PDF</Button>
        </Card>}
      </section>}

      {(showCategoryBreakdown || showLocationSummary) && <section className={`reports-grid-two ${showCategoryBreakdown !== showLocationSummary ? "reports-single-panel" : ""}`}>
        {showCategoryBreakdown && <Card className="reports-panel">
          <div className="reports-panel-heading"><div><h2>Garbage Category Breakdown</h2><p>Recorded quantities and share</p></div></div>
          <div className="reports-breakdown-list">
            {categoryBreakdown.map(category => <div className="reports-breakdown-row" key={category.name}>
              <div className="reports-breakdown-label"><span>{category.name}</span><strong>{category.count.toLocaleString()} <small>({category.share}%)</small></strong></div>
              <div className="reports-progress-track"><span className={category.tone} style={{ width: `${category.share}%` }} /></div>
            </div>)}
          </div>
        </Card>}
        {showLocationSummary && <Card className="reports-panel">
          <div className="reports-panel-heading"><div><h2>Location-wise Report</h2><p>Detections by area</p></div></div>
          <div className="reports-breakdown-list">
            {locationBreakdown.map(location => <div className="reports-breakdown-row" key={location.name}>
              <div className="reports-breakdown-label"><span>{location.name}</span><strong>{location.count.toLocaleString()}</strong></div>
              <div className="reports-progress-track"><span className="navy" style={{ width: `${(location.count / locationBreakdown[0].count) * 100}%` }} /></div>
            </div>)}
          </div>
        </Card>}
      </section>}

      {(showCleanupWorkflow || showSystemStatus) && <section className={`reports-grid-three ${showAllSections ? "" : showCleanupWorkflow ? "reports-single-panel" : "reports-two-panel"}`}>
        {showCleanupWorkflow && <Card className="reports-panel">
          <div className="reports-panel-heading"><div><h2>Detection vs Cleanup</h2><p>Task lifecycle</p></div><Activity size={17} className="reports-panel-icon" /></div>
          <div className="reports-workflow-list">
            {workflow.map(step => <div className="reports-workflow-row" key={step.name}>
              <div><span>{step.name}</span><strong>{step.count.toLocaleString()}</strong></div>
              <div className="reports-progress-track"><span className={step.tone} style={{ width: `${Math.min(100, (step.count / workflow[0].count) * 100)}%` }} /></div>
            </div>)}
          </div>
        </Card>}
        {showSystemStatus && <>
        <Card className="reports-panel">
          <div className="reports-panel-heading"><div><h2>AI Detection Performance</h2><p>Model metrics</p></div><ShieldCheck size={17} className="reports-panel-icon" /></div>
          <div className="reports-summary-list reports-compact-list">
            <div><span>Total detections</span><strong>1,248</strong></div>
            <div><span>Correct detections</span><strong className="text-success">1,208</strong></div>
            <div><span>False detections</span><strong className="text-danger">40</strong></div>
            <div><span>Average confidence</span><strong>93.2%</strong></div>
            <div><span>Model accuracy</span><strong>96.8%</strong></div>
          </div>
        </Card>
        <Card className="reports-panel">
          <div className="reports-panel-heading"><div><h2>IoT Status</h2><p>Hardware network</p></div><Wifi size={17} className="reports-panel-icon" /></div>
          <div className="reports-summary-list reports-compact-list">
            <div><span>Connected cameras</span><strong>24</strong></div>
            <div><span>Online / Offline</span><strong><i className="text-success">23</i> / <i className="text-danger">1</i></strong></div>
            <div><span>Active sensors</span><strong>48</strong></div>
            <div><span>Sensor alerts</span><strong className="text-warning">2</strong></div>
            <div><span>Network status</span><strong className="reports-online"><i />Operational</strong></div>
          </div>
        </Card>
        </>}
      </section>}

      {showRecentReports && <Card className="reports-panel reports-recent-panel">
        <div className="reports-recent-heading">
          <div className="reports-panel-heading"><div><h2>Recent Reports</h2><p>{reportType} · {range.toLowerCase()} reporting</p></div><span className="reports-total-chip">{visibleReports.length} results</span></div>
          <div className="reports-table-tools">
            <label className="reports-search"><Search size={15} /><input aria-label="Search reports" placeholder="Search reports..." value={query} onChange={event => { setQuery(event.target.value); setCurrentPage(1); }} /></label>
            <label className="reports-select"><Filter size={14} /><select aria-label="Filter by garbage type" value={categoryFilter} onChange={event => { setCategoryFilter(event.target.value); setCurrentPage(1); }}><option>All types</option>{categories.map(category => <option key={category}>{category}</option>)}</select><ChevronDown size={13} /></label>
            <label className="reports-select"><select aria-label="Filter by status" value={statusFilter} onChange={event => { setStatusFilter(event.target.value); setCurrentPage(1); }}><option>All statuses</option>{statuses.map(status => <option key={status}>{status}</option>)}</select><ChevronDown size={13} /></label>
          </div>
        </div>
        <div className="table-scroll reports-table-scroll">
          <table className="reports-table">
            <thead><tr><th>S.No.</th><th>Report ID</th><th>Date</th><th>Location</th><th>Garbage type</th><th>Quantity</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {pageReports.map((report, index) => <tr key={report.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td><strong className="reports-id">{report.id}</strong></td>
                <td>{report.date}</td>
                <td><span className="location-cell"><MapPin size={13} />{report.location}</span></td>
                <td><span className={`type-tag ${report.type.toLowerCase()}`}>{report.type}</span></td>
                <td><strong>{report.quantity || "—"}</strong></td>
                <td><span className={`status-tag ${report.status.toLowerCase()}`}><i />{report.status}</span></td>
                <td><div className="reports-row-actions">
                  <button type="button" title="View details" aria-label={`View details for ${report.id}`} onClick={() => setSelectedReport(report)}><Eye size={15} /></button>
                  <button type="button" title="Download report" aria-label={`Download ${report.id}`} onClick={() => downloadCsv(getReportExportData("Detection Activity", [report]), `GarbageDetect_${report.id}.csv`)}><Download size={15} /></button>
                  <button type="button" title="Delete report" aria-label={`Delete ${report.id}`} className="delete" onClick={() => setPendingDelete(report)}><Trash2 size={15} /></button>
                </div></td>
              </tr>)}
              {pageReports.length === 0 && <tr><td colSpan="8" className="reports-empty">No reports match the selected filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="reports-pagination">
          <span>Showing {visibleReports.length ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, visibleReports.length)} of {visibleReports.length} reports</span>
          <div><Button kind="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(page => page - 1)}>Previous</Button><Button kind="secondary" disabled={currentPage >= totalPages || totalPages === 0} onClick={() => setCurrentPage(page => page + 1)}>Next</Button></div>
        </div>
      </Card>}

      {selectedReport && <div className="reports-modal-backdrop" onClick={() => setSelectedReport(null)} role="presentation">
        <section className="reports-modal" role="dialog" aria-modal="true" aria-labelledby="report-details-title" onClick={event => event.stopPropagation()}>
          <div className="reports-modal-heading"><div><h2 id="report-details-title">Report details</h2><p>{selectedReport.id}</p></div><button type="button" aria-label="Close details" onClick={() => setSelectedReport(null)}><X size={18} /></button></div>
          <div className="reports-modal-grid">
            {[ ["Date", selectedReport.date], ["Location", selectedReport.location], ["Garbage type", selectedReport.type], ["Quantity", selectedReport.quantity || "Not recorded"], ["Status", selectedReport.status] ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
          <div className="reports-modal-actions"><Button kind="secondary" onClick={() => downloadCsv(getReportExportData("Detection Activity", [selectedReport]), `GarbageDetect_${selectedReport.id}.csv`)}><Download size={15} />Download record</Button><Button onClick={() => setSelectedReport(null)}>Close</Button></div>
        </section>
      </div>}

      {pendingDelete && <div className="reports-modal-backdrop" onClick={() => setPendingDelete(null)} role="presentation">
        <section className="reports-modal reports-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-report-title" onClick={event => event.stopPropagation()}>
          <div className="reports-modal-heading"><div><h2 id="delete-report-title">Delete report?</h2><p>This will remove {pendingDelete.id} from this report list.</p></div><button type="button" aria-label="Close confirmation" onClick={() => setPendingDelete(null)}><X size={18} /></button></div>
          <div className="reports-modal-actions"><Button kind="secondary" onClick={() => setPendingDelete(null)}>Cancel</Button><Button className="reports-delete-confirm" onClick={handleDelete}><Trash2 size={15} />Delete report</Button></div>
        </section>
      </div>}
    </div>
  );
}
