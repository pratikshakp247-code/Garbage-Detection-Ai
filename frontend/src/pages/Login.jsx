import { useState } from "react";
import {
  Mail,
  LockKeyhole,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Recycle,
  MapPin,
  Activity,
  Bot,
  Truck,
  Leaf,
  Wifi,
  Sparkles,
  CheckCircle2,
  X,
  Radio
} from "lucide-react";

export default function Login({ onLogin }) {
  const [signup, setSignup] = useState(false);
  const [visible, setVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Forgot Password modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Quick autofill demo credentials helper
  const handleDemoFill = () => {
    setEmail("officer@smartcity.gov");
    setPassword("SmartWaste2026!");
    if (signup) {
      setName("Officer Sharma");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("registeredUsers") || "{}");

    // Pre-populate a default demo municipal officer account if not already present
    if (!users["officer@smartcity.gov"]) {
      users["officer@smartcity.gov"] = {
        password: "SmartWaste2026!",
        name: "Officer Sharma (Admin)"
      };
      localStorage.setItem("registeredUsers", JSON.stringify(users));
    }

    if (signup) {
      if (!name.trim()) {
        alert("Please enter your full name.");
        return;
      }
      if (users[email.trim()]) {
        alert("Email is already registered. Please switch to Sign in.");
        return;
      }
      users[email.trim()] = { password, name: name.trim() };
      localStorage.setItem("registeredUsers", JSON.stringify(users));
      localStorage.setItem("currentUser", name.trim());
      localStorage.setItem("currentUserEmail", email.trim());
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim());
      }
      onLogin();
    } else {
      const userRecord = users[email.trim()];
      // Allow demo account bypass or check registered users
      if (!userRecord && email.trim() !== "admin" && email.trim() !== "officer@smartcity.gov") {
        alert("Email not found. Please register first or click 'Autofill Demo' above.");
        return;
      }

      if (userRecord && userRecord.password !== password) {
        alert("Incorrect password. Please try again.");
        return;
      }

      const activeName = userRecord ? userRecord.name : "Municipal Officer";
      localStorage.setItem("currentUser", activeName);
      localStorage.setItem("currentUserEmail", email.trim());
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim());
      }
      onLogin();
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      alert("Please enter your official email address.");
      return;
    }
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setForgotOpen(false);
      setForgotEmail("");
    }, 2800);
  };

  return (
    <main className="login-shell">
      {/* ----------------- LEFT SIDE: LOGIN FORM (45%) ----------------- */}
      <section className="login-panel">
        <div className="login-content">
          {/* Brand & Urban Care Badge */}
          <div className="login-brand-row">
            <div className="govt-brand">
              <div className="govt-brand-mark">
                <Leaf size={22} strokeWidth={2.4} />
              </div>
              <div className="govt-brand-text">
                <span className="govt-brand-title">
                  GarbageDetect <span>AI</span>
                </span>
                <span className="govt-brand-dept">Municipal Clean-City Portal</span>
              </div>
            </div>

            <div className="urban-care-badge" title="Smart City Environmental Intelligence">
              <span className="pulse-dot" />
              AI-POWERED URBAN CARE
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="login-header-group">
            <h1 className="login-title-govt">
              {signup ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="login-subtitle-govt">
              {signup
                ? "Register to join the cleaner, smarter municipal movement."
                : "Sign in to monitor a cleaner, smarter city."}
            </p>
          </div>

          {/* Demo Credentials Helper Pill */}
          <div className="demo-badge-pill">
            <span>
              <b>Smart City Demo:</b> officer@smartcity.gov
            </span>
            <button
              type="button"
              className="demo-fill-btn"
              onClick={handleDemoFill}
              title="One-click autofill for testing"
            >
              Autofill Demo
            </button>
          </div>

          {/* Login Form */}
          <form className="login-form-govt" onSubmit={handleSubmit}>
            {signup && (
              <div className="form-field-group">
                <label className="field-label" htmlFor="user-name">
                  Full Name
                </label>
                <div className="field-input-box">
                  <span className="field-icon-left">
                    <User size={18} />
                  </span>
                  <input
                    id="user-name"
                    aria-label="Full name"
                    className="field-native-input"
                    type="text"
                    placeholder="e.g. Officer Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-field-group">
              <label className="field-label" htmlFor="user-email">
                Work Email
              </label>
              <div className="field-input-box">
                <span className="field-icon-left">
                  <Mail size={18} />
                </span>
                <input
                  id="user-email"
                  aria-label="Work email"
                  className="field-native-input"
                  type="email"
                  placeholder="officer@smartcity.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label" htmlFor="user-password">
                Password
              </label>
              <div className="field-input-box with-right-btn">
                <span className="field-icon-left">
                  <LockKeyhole size={18} />
                </span>
                <input
                  id="user-password"
                  aria-label="Password"
                  className="field-native-input"
                  type={visible ? "text" : "password"}
                  placeholder="Enter your security credentials"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="field-eye-btn"
                  type="button"
                  aria-label={visible ? "Hide password" : "Show password"}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options-row">
              <label className="checkbox-govt">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              {!signup && (
                <button
                  type="button"
                  className="link-forgot"
                  onClick={() => setForgotOpen(true)}
                >
                  Forgot password?
                </button>
              )}
            </div>

            <button type="submit" className="btn-submit-navy">
              <span>{signup ? "Register Account" : "Sign In"}</span>
              <ArrowRight size={18} />
            </button>

            <div className="auth-toggle-row">
              <span>{signup ? "Already have an account?" : "New user?"}</span>
              <button
                type="button"
                className="auth-toggle-btn"
                onClick={() => setSignup(!signup)}
              >
                {signup ? "Sign in" : "Register"}
              </button>
            </div>
          </form>

          {/* Enterprise Security Footer */}
          <div className="govt-security-footer">
            <ShieldCheck size={16} />
            <span>Protected with enterprise-grade security</span>
          </div>
        </div>
      </section>

      {/* ----------------- RIGHT SIDE: SMART CITY VISUAL (55%) ----------------- */}
      <section className="login-visual-smartcity">
        {/* Cyber grid & ambient lighting */}
        <div className="smartcity-grid-pattern" />
        <div className="smartcity-ambient-glow" />
        <div className="smartcity-ambient-glow-two" />

        {/* Top Hero Statement */}
        <div className="smartcity-hero-text">
          <div className="smartcity-badge">
            <Sparkles size={13} />
            MUNICIPAL AI ECOSYSTEM
          </div>
          <h2 className="smartcity-title">
            Smarter Waste Management. Cleaner Cities.
          </h2>
          <p className="smartcity-desc">
            AI-powered waste detection, automated fleet routing, and real-time municipal
            monitoring across all urban zones.
          </p>
        </div>

        {/* Center: Modern Smart City Illustration Scene */}
        <div className="smartcity-scene-wrapper">
          {/* Animated AI Detection Bounding Box Overlay 1 */}
          <div className="ai-overlay-box box-one">
            <Bot size={15} color="#60A5FA" />
            <span>AI DETECT: Plastic Waste · 98.4%</span>
          </div>

          {/* Animated AI Detection Bounding Box Overlay 2 */}
          <div className="ai-overlay-box box-two">
            <Radio size={15} color="#34D399" />
            <span>IOT SENSOR: Smart Bin #104 · 82% Full</span>
          </div>

          {/* High-Quality Smart City Vector Illustration */}
          <svg
            className="smartcity-scene-svg"
            viewBox="0 0 600 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="300" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1E3A8A" stopOpacity="0.3" />
                <stop stopColor="#0F172A" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="buildingGrad1" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" stopOpacity="0.4" />
                <stop stopColor="#1E3A8A" stopOpacity="0.75" />
              </linearGradient>
              <linearGradient id="buildingGrad2" x1="0" y1="0" x2="0" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563EB" stopOpacity="0.5" />
                <stop stopColor="#0F2A5E" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="buildingGrad3" x1="0" y1="0" x2="0" y2="240" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" stopOpacity="0.6" />
                <stop stopColor="#1D4ED8" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="roadGrad" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0B192E" />
                <stop stopColor="#132B4F" />
                <stop stopColor="#0B192E" />
              </linearGradient>
              <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#10B981" stopOpacity="0" />
                <stop stopColor="#10B981" stopOpacity="0.8" />
                <stop stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Background Perspective Grid */}
            <path d="M 0 240 L 600 240" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <path d="M 50 240 L 0 300" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
            <path d="M 150 240 L 100 300" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
            <path d="M 300 240 L 300 300" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
            <path d="M 450 240 L 500 300" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
            <path d="M 550 240 L 600 300" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />

            {/* City Skyline Silhouettes */}
            {/* Background Towers */}
            <rect x="40" y="100" width="55" height="140" rx="4" fill="url(#buildingGrad1)" />
            <rect x="110" y="60" width="65" height="180" rx="4" fill="url(#buildingGrad2)" />
            <polygon points="142,30 138,60 147,60" fill="#60A5FA" />
            <rect x="190" y="115" width="50" height="125" rx="4" fill="url(#buildingGrad1)" />

            <rect x="255" y="75" width="80" height="165" rx="5" fill="url(#buildingGrad3)" />
            {/* Center Solar Crown Roof */}
            <path d="M 255 75 Q 295 55 335 75 Z" fill="#34D399" opacity="0.6" />

            <rect x="350" y="90" width="60" height="150" rx="4" fill="url(#buildingGrad2)" />
            <rect x="425" y="50" width="70" height="190" rx="4" fill="url(#buildingGrad3)" />
            <polygon points="460,20 457,50 463,50" fill="#38BDF8" />
            <rect x="510" y="110" width="55" height="130" rx="4" fill="url(#buildingGrad1)" />

            {/* Architectural Glowing Windows */}
            {[
              [122, 80], [140, 80], [122, 105], [140, 105], [122, 130], [140, 130],
              [270, 95], [290, 95], [310, 95], [270, 120], [290, 120], [310, 120],
              [270, 145], [290, 145], [310, 145], [440, 75], [465, 75], [440, 100],
              [465, 100], [440, 125], [465, 125], [440, 150], [465, 150]
            ].map(([wx, wy], i) => (
              <rect
                key={i}
                x={wx}
                y={wy}
                width="12"
                height="15"
                rx="2"
                fill="#93C5FD"
                opacity={0.35 + (i % 3) * 0.25}
              />
            ))}

            {/* Smart Green City Trees & Park Buffer */}
            <circle cx="80" cy="225" r="16" fill="#059669" opacity="0.8" />
            <circle cx="100" cy="228" r="12" fill="#10B981" opacity="0.85" />
            <circle cx="360" cy="226" r="15" fill="#059669" opacity="0.8" />
            <circle cx="380" cy="228" r="13" fill="#10B981" opacity="0.85" />
            <circle cx="510" cy="225" r="16" fill="#059669" opacity="0.8" />

            {/* Municipal Highway / Road Platform */}
            <rect x="0" y="240" width="600" height="55" fill="url(#roadGrad)" />
            {/* Glowing Fleet Route Guide Line */}
            <line
              x1="0"
              y1="268"
              x2="600"
              y2="268"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeDasharray="16 10"
              opacity="0.85"
            />

            {/* Smart Waste Collection Electric Truck */}
            <g transform="translate(195, 240)">
              {/* Telemetry Route Radar Beam */}
              <ellipse cx="65" cy="22" rx="45" ry="12" fill="url(#beamGrad)" />
              {/* Truck Cabin & Body */}
              <rect x="25" y="6" width="55" height="26" rx="4" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1.5" />
              <path d="M 0 16 L 25 16 L 25 32 L 0 32 Z" fill="#2563EB" />
              <polygon points="4,18 18,18 25,24 4,24" fill="#93C5FD" opacity="0.8" />
              {/* Green EV Fleet Badge */}
              <circle cx="52" cy="19" r="6" fill="#10B981" />
              <path d="M 50 19 L 52 21 L 55 17" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
              {/* Wheels */}
              <circle cx="10" cy="33" r="5" fill="#0F172A" stroke="#60A5FA" strokeWidth="1.5" />
              <circle cx="62" cy="33" r="5" fill="#0F172A" stroke="#60A5FA" strokeWidth="1.5" />
              {/* Headlights */}
              <polygon points="-1,23 -15,18 -15,28" fill="#FDE047" opacity="0.5" />
            </g>

            {/* Smart Waste Bins with IoT Telemetry Status */}
            <g transform="translate(425, 222)">
              {/* Concentric IoT Radar Rings */}
              <circle cx="14" cy="18" r="22" stroke="#10B981" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
              <circle cx="14" cy="18" r="14" stroke="#10B981" strokeWidth="1.2" opacity="0.6" />
              {/* Bin Body */}
              <rect x="6" y="8" width="16" height="22" rx="3" fill="#0F2D54" stroke="#10B981" strokeWidth="1.5" />
              {/* Fill indicator (82%) */}
              <rect x="8" y="12" width="12" height="16" rx="2" fill="#10B981" opacity="0.85" />
              {/* IoT Sensor Cap */}
              <rect x="4" y="5" width="20" height="3" rx="1.5" fill="#34D399" />
              <circle cx="14" cy="6" r="1.5" fill="#F8FAFC" />
            </g>

            {/* Second IoT Bin Station */}
            <g transform="translate(115, 222)">
              <rect x="6" y="8" width="16" height="22" rx="3" fill="#0F2D54" stroke="#3B82F6" strokeWidth="1.5" />
              <rect x="8" y="18" width="12" height="10" rx="2" fill="#3B82F6" opacity="0.85" />
              <rect x="4" y="5" width="20" height="3" rx="1.5" fill="#60A5FA" />
            </g>

            {/* AI Bounding Box Visual Focus Point */}
            <g transform="translate(290, 205)">
              <rect x="0" y="0" width="38" height="28" rx="2" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="4 2" />
              <circle cx="19" cy="14" r="3" fill="#60A5FA" />
            </g>
          </svg>
        </div>

        {/* Bottom Glass-style Information Panel (KPI Stats) */}
        <div className="smartcity-glass-panel">
          <div className="glass-panel-header">
            <div className="glass-panel-title">
              <Activity size={16} color="#60A5FA" />
              <span>Municipal Fleet & Environmental Metrics</span>
            </div>
            <div className="live-telemetry-badge">
              <span className="live-telemetry-dot" />
              Live Telemetry
            </div>
          </div>

          <div className="smartcity-stats-grid">
            {/* Stat 1: Network Status */}
            <div className="smartcity-stat-card">
              <div className="smartcity-stat-top">
                <span className="smartcity-stat-label">Network Status</span>
                <div className="stat-icon-wrap green">
                  <Wifi size={16} />
                </div>
              </div>
              <span className="smartcity-stat-val">Live</span>
              <span className="smartcity-stat-sub">99.98% Uptime</span>
            </div>

            {/* Stat 2: Detection Accuracy */}
            <div className="smartcity-stat-card">
              <div className="smartcity-stat-top">
                <span className="smartcity-stat-label">Accuracy</span>
                <div className="stat-icon-wrap blue">
                  <ShieldCheck size={16} />
                </div>
              </div>
              <span className="smartcity-stat-val">96.8%</span>
              <span className="smartcity-stat-sub">YOLOv8 Edge AI</span>
            </div>

            {/* Stat 3: Active Monitoring Zones */}
            <div className="smartcity-stat-card">
              <div className="smartcity-stat-top">
                <span className="smartcity-stat-label">Active Zones</span>
                <div className="stat-icon-wrap cyan">
                  <MapPin size={16} />
                </div>
              </div>
              <span className="smartcity-stat-val">24</span>
              <span className="smartcity-stat-sub">Real-Time GIS</span>
            </div>

            {/* Stat 4: Waste Diverted This Month */}
            <div className="smartcity-stat-card">
              <div className="smartcity-stat-top">
                <span className="smartcity-stat-label">Waste Diverted</span>
                <div className="stat-icon-wrap purple">
                  <Recycle size={16} />
                </div>
              </div>
              <span className="smartcity-stat-val">18.4 Tons</span>
              <span className="smartcity-stat-sub">+12% This Month</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- FORGOT PASSWORD MODAL ----------------- */}
      {forgotOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "rgba(10, 25, 47, 0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setForgotOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
              position: "relative",
              border: "1px solid #E2E8F0"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setForgotOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                border: "none",
                background: "transparent",
                color: "#64748B",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "8px"
              }}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#EFF6FF",
                  color: "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <LockKeyhole size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: "19px", fontWeight: "700", color: "#0F223D" }}>
                Reset Password
              </h3>
            </div>

            {forgotSent ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <CheckCircle2 size={44} color="#10B981" style={{ margin: "0 auto 12px" }} />
                <h4 style={{ margin: "0 0 6px 0", color: "#0F223D", fontSize: "16px" }}>
                  Recovery Link Dispatched
                </h4>
                <p style={{ margin: 0, color: "#64748B", fontSize: "13.5px", lineHeight: "1.5" }}>
                  A secure password reset link has been sent to <b>{forgotEmail}</b>. Please check your municipal email inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <p style={{ margin: "0 0 16px 0", color: "#64748B", fontSize: "13.5px", lineHeight: "1.5" }}>
                  Enter your registered work email to receive a password recovery link.
                </p>
                <div className="form-field-group" style={{ marginBottom: "18px" }}>
                  <label className="field-label" htmlFor="forgot-email">
                    Work Email Address
                  </label>
                  <div className="field-input-box">
                    <span className="field-icon-left">
                      <Mail size={18} />
                    </span>
                    <input
                      id="forgot-email"
                      type="email"
                      className="field-native-input"
                      placeholder="officer@smartcity.gov"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <button type="submit" className="btn-submit-navy" style={{ margin: 0 }}>
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
