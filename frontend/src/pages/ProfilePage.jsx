import { useState } from "react";
import { Camera, Edit2, ShieldCheck, Check } from "lucide-react";
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';

export default function ProfilePage() {
  const currentUserName = localStorage.getItem('currentUser') || 'Alex Morgan';
  const currentUserEmail = localStorage.getItem('currentUserEmail') || 'alex@greencity.gov';
  const userInitials = currentUserName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const [initialFirst, ...lastNameParts] = currentUserName.split(' ');
  const initialLast = lastNameParts.join(' ');

  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [email, setEmail] = useState(currentUserEmail);
  const [phone, setPhone] = useState(localStorage.getItem('currentUserPhone') || "");
  const [dept, setDept] = useState(localStorage.getItem('currentUserDept') || "");
  const [location, setLocation] = useState(localStorage.getItem('currentUserLoc') || "");
  
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('currentUser', `${firstName} ${lastName}`.trim());
    localStorage.setItem('currentUserEmail', email);
    localStorage.setItem('currentUserPhone', phone);
    localStorage.setItem('currentUserDept', dept);
    localStorage.setItem('currentUserLoc', location);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.location.reload(); // Reload to update header and sidebar globally
    }, 1500);
  };

  return (
    <div className="page-content profile-page" style={{ fontFamily: 'inherit', color: 'var(--ink)' }}>
      <div className="welcome-row">
        <div>
          <div className="welcome-title">My Profile</div>
          <div className="welcome-sub">Manage your personal information and preferences.</div>
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #dbe7fa, #8ba9d8)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-dark)", fontSize: "28px", fontWeight: "bold" }}>
                  {userInitials}
                </div>
                <button style={{ position: "absolute", bottom: 0, right: 0, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "50%", padding: "6px", cursor: "pointer", color: "var(--muted)", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <b style={{ fontSize: "20px", display: "block" }}>{currentUserName}</b>
                <span style={{ color: "var(--muted)", fontSize: "13px" }}>City Administrator</span>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Button kind="secondary" onClick={() => alert("Edit mode enabled.")}><Edit2 size={14} /> Edit Profile</Button>
              </div>
            </div>
            
            <div className="profile-fields" style={{ padding: "0" }}>
              <label><span>First Name</span><Field value={firstName} onChange={setFirstName} /></label>
              <label><span>Last Name</span><Field value={lastName} onChange={setLastName} /></label>
              <label><span>Email Address</span><Field value={email} onChange={setEmail} /></label>
              <label><span>Phone Number</span><Field placeholder="+1 (555) 123-4567" value={phone} onChange={setPhone} /></label>
              <label><span>Department</span><Field placeholder="Environmental Services" value={dept} onChange={setDept} /></label>
              <label><span>Location</span><Field placeholder="Green City Metro" value={location} onChange={setLocation} /></label>
            </div>
            
            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px" }}>
              {saved && <span style={{ color: "var(--green-dark)", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}><Check size={14} /> Profile saved successfully!</span>}
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Card>
            <h3 style={{ fontSize: "14px", margin: "0 0 16px" }}>Account Status</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--green-pale)", borderRadius: "10px", color: "var(--green-dark)" }}>
              <ShieldCheck size={24} />
              <div>
                <b style={{ display: "block", fontSize: "13px" }}>Active Account</b>
                <span style={{ fontSize: '14px', opacity: 0.8 }}>Last login: Today at 09:41 AM</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
