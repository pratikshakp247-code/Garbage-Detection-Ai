
import { LayoutDashboard, Focus, Video, Clock3, FileBarChart, Map, BarChart3, Bell, Settings, Truck, AlertTriangle } from "lucide-react";
export const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Detection", icon: Focus },
  { label: "Live Camera", icon: Video },
  { label: "History", icon: Clock3 },
  { label: "Reports", icon: FileBarChart },
  { label: "Map", icon: Map },
  { label: "Waste Collection Fleet", icon: Truck },
  { label: "Analytics", icon: BarChart3 },
  { label: "Alerts & Incidents", icon: AlertTriangle },
  { label: "Notifications", icon: Bell },
  { label: "Settings", icon: Settings }
];
export const detections = [
  { id: "d1", date: "May 24, 2025", time: "10:42 AM", location: "Riverside Park", type: "Plastic", confidence: "96%", status: "Assigned" },
  { id: "d2", date: "May 24, 2025", time: "09:18 AM", location: "Market Street", type: "Organic", confidence: "92%", status: "Cleaned" },
  { id: "d3", date: "May 23, 2025", time: "04:35 PM", location: "Central Station", type: "Paper", confidence: "89%", status: "Pending" },
  { id: "d4", date: "May 23, 2025", time: "01:08 PM", location: "Harbor Avenue", type: "Glass", confidence: "94%", status: "Cleaned" },
  { id: "d5", date: "May 22, 2025", time: "11:21 AM", location: "Oakwood Block", type: "Metal", confidence: "91%", status: "Assigned" }
];
