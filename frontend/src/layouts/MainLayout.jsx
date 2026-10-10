import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";

export default function MainLayout({ dark, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`app-shell ${dark ? "dark" : ""}`}>
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onLogout={onLogout} 
      />
      <div className="main-shell">
        <Header 
          onMenu={() => setSidebarOpen(true)} 
          onLogout={onLogout} 
        />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
