import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { NavBar } from '../components/NavBar';
import { updateUserTargets } from '../utils/api';
import './UserProfile.css';

export default function UserProfile() {
  const { userData, login: authLogin, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing,  setIsEditing]  = useState(false);
  const [editValues, setEditValues] = useState({});
  const [editError,  setEditError]  = useState("");
  const [saving,     setSaving]     = useState(false);

  const name      = userData?.userName || "User";
  const email     = userData?.email    || "";
  const initials  = name.slice(0, 2).toUpperCase();
  const targetCal = userData?.targetCal;
  const protein   = userData?.protein;
  const carbs     = userData?.carbs;
  const fat       = userData?.fat;
  const dateLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });

  function handleLogout() {
    logout();
    navigate("/auth?mode=login");
  }

  function startEditing() {
    setEditValues({ targetCal: targetCal || 0, protein: protein || 0, carbs: carbs || 0, fat: fat || 0 });
    setEditError("");
    setIsEditing(true);
  }

  async function handleSaveTargets() {
    setSaving(true);
    setEditError("");
    try {
      const res  = await updateUserTargets(userData.userId, {
        calories: editValues.targetCal,
        protein:  editValues.protein,
        carbs:    editValues.carbs,
        fat:      editValues.fat,
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.message || "Failed to save targets.");
        return;
      }
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...savedUser,
        calories: editValues.targetCal,
        protein:  editValues.protein,
        carbs:    editValues.carbs,
        fat:      editValues.fat,
      }));
      authLogin({
        ...userData,
        targetCal: editValues.targetCal,
        protein:   editValues.protein,
        carbs:     editValues.carbs,
        fat:       editValues.fat,
      });
      setIsEditing(false);
    } catch {
      setEditError("Could not connect to server.");
    } finally {
      setSaving(false);
    }
  }

  const targetRows = [
    { label: "Calories", key: "targetCal", val: targetCal, unit: "kcal", color: "#f0ede6" },
    { label: "Protein",  key: "protein",   val: protein,   unit: "g",    color: "#4ade80" },
    { label: "Carbs",    key: "carbs",     val: carbs,     unit: "g",    color: "#60a5fa" },
    { label: "Fat",      key: "fat",       val: fat,       unit: "g",    color: "#f97316" },
  ];

  return (
    <div className="profile-page">
      <NavBar
        onLogout={handleLogout}
        middleSlot={
          <>
            <button onClick={() => navigate("/tracker")}>Tracker</button>
            <button onClick={()=> navigate("/dashboard")}>Dashboard</button>
            <button className="active">Profile</button>
          </>
        }
        rightSlot={<span className="date-label">{dateLabel}</span>}
      />

      <div className="profile-body">

        <div className="profile-card">
          <div className="profile-avatar">{initials}</div>
          <div>
            <p className="profile-info-name">{name}</p>
            <p className="profile-info-email">{email}</p>
          </div>
        </div>

        <div className="profile-targets-section">
          <div className="profile-targets-header">
            <p className="profile-targets-title">Daily Targets</p>
            {!isEditing && (
              <button className="profile-edit-btn" onClick={startEditing}>Edit</button>
            )}
          </div>

          {isEditing ? (
            <div className="profile-edit-form">
              <div className="profile-targets-grid">
                {targetRows.map(m => (
                  <div key={m.key} className="profile-target-item">
                    <label className="profile-target-label" style={{ color: m.color }}>{m.label}</label>
                    <input
                      type="number"
                      value={editValues[m.key] ?? ""}
                      onChange={e => setEditValues(prev => ({ ...prev, [m.key]: parseInt(e.target.value) || 0 }))}
                      className="profile-target-input"
                    />
                    <span className="profile-target-unit">{m.unit}</span>
                  </div>
                ))}
              </div>
              {editError && <p className="profile-edit-error">{editError}</p>}
              <div className="profile-edit-actions">
                <button onClick={handleSaveTargets} disabled={saving} className="profile-save-btn">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => { setIsEditing(false); setEditError(""); }} className="profile-cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-targets-grid">
              {targetRows.map(m => (
                <div key={m.label} className="profile-target-item">
                  <div className="profile-target-val" style={{ color: m.color }}>{m.val ?? "—"}</div>
                  <div className="profile-target-unit">{m.unit}</div>
                  <div className="profile-target-label">{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
