import { useMemo, useRef, useState } from "react";
import {
  Building2, Camera, Check, CheckCircle2, Clock3, Edit2, KeyRound,
  LockKeyhole, Mail, MapPin, Phone, ShieldCheck, UserRound
} from "lucide-react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";

const readProfile = () => {
  const fullName = localStorage.getItem("currentUser") || "Alex Morgan";
  const [firstName = "", ...lastNameParts] = fullName.trim().split(/\s+/);
  return {
    firstName,
    lastName: lastNameParts.join(" "),
    email: localStorage.getItem("currentUserEmail") || "alex@greencity.gov",
    phone: localStorage.getItem("currentUserPhone") || "",
    department: localStorage.getItem("currentUserDept") || "Environmental Services",
    designation: localStorage.getItem("currentUserTitle") || "City Administrator",
    officeLocation: localStorage.getItem("currentUserLoc") || "Green City Metro",
    photo: localStorage.getItem("currentUserPhoto") || "",
  };
};

const profileFields = [
  { key: "firstName", label: "First Name", icon: UserRound, type: "text" },
  { key: "lastName", label: "Last Name", icon: UserRound, type: "text" },
  { key: "email", label: "Email Address", icon: Mail, type: "email" },
  { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
  { key: "department", label: "Department", icon: Building2, type: "text" },
  { key: "designation", label: "Designation / Job Title", icon: ShieldCheck, type: "text" },
  { key: "officeLocation", label: "Office Location", icon: MapPin, type: "text" },
];

export default function ProfilePage() {
  const initialProfile = useMemo(readProfile, []);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [draftProfile, setDraftProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");
  const fileInputRef = useRef(null);
  const [passwordFields, setPasswordFields] = useState({ current: "", next: "", confirm: "" });
  const [passwordFeedback, setPasswordFeedback] = useState({ type: "", message: "" });

  const fullName = `${draftProfile.firstName} ${draftProfile.lastName}`.trim();
  const initials = fullName.split(/\s+/).filter(Boolean).map(part => part[0]).join("").slice(0, 2).toUpperCase();
  const hasChanges = JSON.stringify(savedProfile) !== JSON.stringify(draftProfile);
  const emailVerified = localStorage.getItem("currentUserEmailVerified") === "true";
  const lastLogin = localStorage.getItem("currentUserLastLogin") || "Current session";

  const updateField = (key, value) => {
    setDraftProfile(profile => ({ ...profile, [key]: value }));
    setErrors(current => ({ ...current, [key]: "" }));
  };

  const handleEdit = () => {
    setDraftProfile({ ...savedProfile });
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraftProfile({ ...savedProfile });
    setErrors({});
    setIsEditing(false);
  };

  const handlePhotoChange = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors(current => ({ ...current, photo: "Choose an image file." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors(current => ({ ...current, photo: "Choose an image smaller than 2 MB." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateField("photo", String(reader.result || ""));
      setErrors(current => ({ ...current, photo: "" }));
    };
    reader.onerror = () => setErrors(current => ({ ...current, photo: "Unable to read this image." }));
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const validateProfile = () => {
    const nextErrors = {};
    for (const field of profileFields) {
      if (!draftProfile[field.key].trim()) nextErrors[field.key] = `${field.label} is required.`;
    }
    if (draftProfile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draftProfile.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    const phoneDigits = draftProfile.phone.replace(/\D/g, "");
    if (draftProfile.phone && (!/^\+?[\d\s().-]+$/.test(draftProfile.phone.trim()) || phoneDigits.length < 7 || phoneDigits.length > 15)) {
      nextErrors.phone = "Enter a valid phone number with 7 to 15 digits.";
    }

    const users = JSON.parse(localStorage.getItem("registeredUsers") || "{}");
    const currentEmail = localStorage.getItem("currentUserEmail") || savedProfile.email;
    const currentAccountKey = Object.keys(users).find(key => key.toLowerCase() === currentEmail.toLowerCase());
    const emailTaken = Object.keys(users).some(key => key.toLowerCase() === draftProfile.email.trim().toLowerCase() && key !== currentAccountKey);
    if (emailTaken) nextErrors.email = "This email is already linked to another account.";

    setErrors(nextErrors);
    return { valid: Object.keys(nextErrors).length === 0, users, currentEmail, currentAccountKey };
  };

  const handleSave = async event => {
    event.preventDefault();
    if (!hasChanges || isSaving) return;
    const validation = validateProfile();
    if (!validation.valid) return;

    setIsSaving(true);
    await new Promise(resolve => window.setTimeout(resolve, 300));
    try {
      const nextProfile = { ...draftProfile, firstName: draftProfile.firstName.trim(), lastName: draftProfile.lastName.trim(), email: draftProfile.email.trim() };
      const nextFullName = `${nextProfile.firstName} ${nextProfile.lastName}`.trim();
      localStorage.setItem("currentUser", nextFullName);
      localStorage.setItem("currentUserEmail", nextProfile.email);
      localStorage.setItem("currentUserPhone", nextProfile.phone.trim());
      localStorage.setItem("currentUserDept", nextProfile.department.trim());
      localStorage.setItem("currentUserTitle", nextProfile.designation.trim());
      localStorage.setItem("currentUserLoc", nextProfile.officeLocation.trim());
      if (nextProfile.photo) localStorage.setItem("currentUserPhoto", nextProfile.photo);
      else localStorage.removeItem("currentUserPhoto");

      if (validation.currentAccountKey) {
        const userRecord = validation.users[validation.currentAccountKey];
        if (validation.currentAccountKey !== nextProfile.email) delete validation.users[validation.currentAccountKey];
        validation.users[nextProfile.email] = { ...userRecord, name: nextFullName };
        localStorage.setItem("registeredUsers", JSON.stringify(validation.users));
      }

      setSavedProfile(nextProfile);
      setDraftProfile(nextProfile);
      setIsEditing(false);
      setToast("Profile changes saved successfully.");
      window.dispatchEvent(new Event("profileUpdated"));
      window.setTimeout(() => setToast(""), 3500);
    } catch {
      setErrors(current => ({ ...current, form: "Unable to save your profile. Check available browser storage and try again." }));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = event => {
    event.preventDefault();
    setPasswordFeedback({ type: "", message: "" });
    if (!passwordFields.current || !passwordFields.next || !passwordFields.confirm) {
      setPasswordFeedback({ type: "error", message: "Complete all three password fields." });
      return;
    }
    if (passwordFields.next.length < 8) {
      setPasswordFeedback({ type: "error", message: "New password must be at least 8 characters." });
      return;
    }
    if (passwordFields.next !== passwordFields.confirm) {
      setPasswordFeedback({ type: "error", message: "New password and confirmation do not match." });
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "{}");
      const accountKey = Object.keys(users).find(key => key.toLowerCase() === savedProfile.email.toLowerCase());
      if (!accountKey || !users[accountKey]?.password) {
        setPasswordFeedback({ type: "error", message: "Password changes are unavailable for this account without a registered credential." });
        return;
      }
      if (users[accountKey].password !== passwordFields.current) {
        setPasswordFeedback({ type: "error", message: "Current password is incorrect." });
        return;
      }

      users[accountKey] = { ...users[accountKey], password: passwordFields.next };
      localStorage.setItem("registeredUsers", JSON.stringify(users));
      setPasswordFields({ current: "", next: "", confirm: "" });
      setPasswordFeedback({ type: "success", message: "Password updated successfully." });
    } catch {
      setPasswordFeedback({ type: "error", message: "Unable to update the password in browser storage." });
    }
  };

  return (
    <div className="page-content profile-page">
      {toast && <div className="profile-toast" role="status"><CheckCircle2 size={17} />{toast}</div>}
      <header className="profile-page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal information and account settings</p>
        </div>
      </header>

      <div className="profile-dashboard-grid">
        <div className="profile-main-column">
          <Card className="profile-main-card">
            <div className="profile-card-heading">
              <div className="profile-identity">
                <div className="profile-avatar-wrap">
                  <div className="profile-avatar">
                    {draftProfile.photo ? <img src={draftProfile.photo} alt={`${fullName} profile`} /> : initials}
                  </div>
                  {isEditing && <>
                    <input ref={fileInputRef} className="profile-photo-input" type="file" accept="image/*" onChange={handlePhotoChange} aria-label="Upload profile photo" />
                    <button type="button" className="profile-photo-button" onClick={() => fileInputRef.current?.click()} title="Change profile photo" aria-label="Change profile photo"><Camera size={16} /></button>
                  </>}
                </div>
                <div className="profile-identity-copy">
                  <h2>{fullName}</h2>
                  <p>{draftProfile.designation}</p>
                  <span>{draftProfile.department}</span>
                </div>
              </div>
              {!isEditing && <Button kind="secondary" onClick={handleEdit}><Edit2 size={15} /> Edit Profile</Button>}
            </div>

            {errors.photo && <p className="profile-error-banner" role="alert">{errors.photo}</p>}
            {!isEditing ? (
              <div className="profile-detail-grid">
                {profileFields.map(({ key, label, icon: Icon }) => (
                  <div className="profile-detail" key={key}>
                    <span><Icon size={15} />{label}</span>
                    <strong>{savedProfile[key] || "Not provided"}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSave} noValidate>
                <div className="profile-edit-grid">
                  {profileFields.map(({ key, label, type }) => (
                    <label className="profile-input-label" key={key} htmlFor={`profile-${key}`}>
                      <span>{label} <b>*</b></span>
                      <input
                        id={`profile-${key}`}
                        type={type}
                        value={draftProfile[key]}
                        onChange={event => updateField(key, event.target.value)}
                        autoComplete={key === "firstName" ? "given-name" : key === "lastName" ? "family-name" : key === "email" ? "email" : key === "phone" ? "tel" : "off"}
                        aria-invalid={Boolean(errors[key])}
                        aria-describedby={errors[key] ? `profile-error-${key}` : undefined}
                      />
                      {errors[key] && <small id={`profile-error-${key}`} role="alert">{errors[key]}</small>}
                    </label>
                  ))}
                </div>
                {errors.form && <p className="profile-error-banner" role="alert">{errors.form}</p>}
                <div className="profile-form-actions">
                  <Button kind="secondary" type="button" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                  <Button kind="primary" type="submit" disabled={!hasChanges || isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </Card>

          <Card className="profile-password-card">
            <div className="profile-section-heading">
              <div className="profile-section-icon"><KeyRound size={18} /></div>
              <div><h2>Change Password</h2><p>Update your sign-in password securely.</p></div>
            </div>
            <form className="profile-password-form" onSubmit={handlePasswordChange}>
              <label className="profile-input-label" htmlFor="current-password"><span>Current Password <b>*</b></span><input id="current-password" type="password" autoComplete="current-password" value={passwordFields.current} onChange={event => setPasswordFields(fields => ({ ...fields, current: event.target.value }))} /></label>
              <label className="profile-input-label" htmlFor="new-password"><span>New Password <b>*</b></span><input id="new-password" type="password" autoComplete="new-password" minLength={8} value={passwordFields.next} onChange={event => setPasswordFields(fields => ({ ...fields, next: event.target.value }))} /></label>
              <label className="profile-input-label" htmlFor="confirm-password"><span>Confirm Password <b>*</b></span><input id="confirm-password" type="password" autoComplete="new-password" value={passwordFields.confirm} onChange={event => setPasswordFields(fields => ({ ...fields, confirm: event.target.value }))} /></label>
              {passwordFeedback.message && <p className={`profile-password-feedback ${passwordFeedback.type}`} role={passwordFeedback.type === "error" ? "alert" : "status"}>{passwordFeedback.message}</p>}
              <div className="profile-form-actions"><Button kind="secondary" type="submit"><LockKeyhole size={15} /> Update Password</Button></div>
            </form>
          </Card>
        </div>

        <Card className="profile-status-card">
          <div className="profile-section-heading">
            <div className="profile-section-icon"><ShieldCheck size={19} /></div>
            <div><h2>Account Status</h2><p>Account and access information</p></div>
          </div>
          <div className="profile-account-state"><span className="profile-state-dot" />Active Account</div>
          <div className="profile-status-list">
            <div><span><Clock3 size={15} />Last login</span><strong>{lastLogin}</strong></div>
            <div><span><Mail size={15} />Email verification</span><strong className={emailVerified ? "verified" : "unverified"}>{emailVerified ? "Verified" : "Not verified"}</strong></div>
            <div><span><Building2 size={15} />Department</span><strong>{savedProfile.department}</strong></div>
          </div>
          <div className="profile-security-note"><ShieldCheck size={16} />Your account is protected by the municipal administration access policy.</div>
        </Card>
      </div>
    </div>
  );
}