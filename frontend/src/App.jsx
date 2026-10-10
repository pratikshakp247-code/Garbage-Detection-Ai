import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import MainLayout from './layouts/MainLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Detection from './pages/Detection.jsx';
import LiveCamera from './pages/LiveCamera.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import Reports from './pages/Reports.jsx';
import MapPage from './pages/MapPage.jsx';
import VehiclesPage from './pages/VehiclesPage.jsx';
import Analytics from './pages/Analytics.jsx';
import Notifications from './pages/Notifications.jsx';
import UserManagement from './pages/UserManagement.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AlertsPage from './pages/AlertsPage.jsx';

function AppRoutes({ loggedIn, handleLogin, handleLogout, dark, setDark }) {
  const navigate = useNavigate();
  
  const navigateTo = (target, filter = "", status = "All statuses") => {
    const path = `/${target.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`;
    navigate(path, { state: { filter, status } });
  };

  if (!loggedIn) return <Login onLogin={handleLogin} />;
  
  return (
    <Routes>
      <Route path="/" element={<MainLayout dark={dark} onLogout={handleLogout} />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard navigate={navigateTo} />} />
        <Route path="detection" element={<Detection />} />
        <Route path="live-camera" element={<LiveCamera />} />
        <Route path="history" element={<HistoryPage initialQuery="" initialStatus="All statuses" />} />
        <Route path="reports" element={<Reports />} />
        <Route path="map" element={<MapPage navigate={navigateTo} />} />
        <Route path="waste-collection-fleet" element={<VehiclesPage />} />
        <Route path="analytics" element={<Analytics navigate={navigateTo} />} />
        <Route path="alerts-incidents" element={<AlertsPage />} />
        <Route path="notifications" element={<Notifications navigate={navigateTo} />} />
        <Route path="settings" element={<SettingsPage dark={dark} onDark={() => {
          const newDark = !dark;
          setDark(newDark);
          localStorage.setItem("darkTheme", newDark);
        }} onLogout={handleLogout} />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="usermanagement" element={<UserManagement navigate={navigateTo} />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("loggedIn") === "true");
  const [dark, setDark] = useState(() => localStorage.getItem("darkTheme") === "true");

  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <AppRoutes 
        loggedIn={loggedIn} 
        handleLogin={handleLogin} 
        handleLogout={handleLogout} 
        dark={dark} 
        setDark={setDark} 
      />
    </BrowserRouter>
  );
}
// Trigger HMR
