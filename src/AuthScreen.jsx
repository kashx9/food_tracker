import { useState } from "react";

const C = {
  bg: "#0d0d0d",
  card: "#1a1a1a",
  surface: "#161616",
  border: "rgba(255,255,255,0.07)",
  text: "#f0ede6",
  muted: "#6a6a62",
  accent: "#e8ff47",
  accentDim: "rgba(232,255,71,0.12)",
  accentBorder: "rgba(232,255,71,0.25)",
  red: "#ff4f4f",
};

// ── Reusable input ────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder, error }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "11px", color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          border: `0.5px solid ${error ? C.red : "rgba(255,255,255,0.12)"}`,
          color: C.text,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          padding: "0 14px",
          height: "44px",
          borderRadius: "8px",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
      />
      {error && <p style={{ fontSize: "11px", color: C.red, marginTop: "4px" }}>{error}</p>}
    </div>
  );
}

// ── Main Auth Screen ──────────────────────────
export default function AuthScreen({ userData, onAuthSuccess, onBack, initialMode = "signup" }) {
  const [mode, setMode] = useState(initialMode); // "signup" | "login"

  // form fields
  const [name,     setName]     = useState(userData?.userName || "");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  // ui state
  const [loading, setLoading]   = useState(false);
  const [errors,  setErrors]    = useState({});
  const [apiError, setApiError] = useState("");

  function validate() {
    const e = {};
    if (mode === "signup" && !name.trim())       e.name     = "Name is required";
    if (!email.includes("@"))                    e.email    = "Enter a valid email";
    if (password.length < 6)                     e.password = "Password must be at least 6 characters";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setErrors({});
    setApiError("");
    setLoading(true);

    try {
      const endpoint = mode === "signup"
        ? "http://localhost:5000/api/v1/auth/register"
        : "http://localhost:5000/api/v1/auth/login";

      const body = mode === "signup"
        ? { name, email, password }
        : { email, password };

      const res  = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Something went wrong. Try again.");
        setLoading(false);
        return;
      }

      // Save token to localStorage so future API calls can use it
      localStorage.setItem("token", data.data.token);
      
      localStorage.setItem("user", JSON.stringify({
          userId: data.data.user._id,
          email: data.data.user.email,
          name: data.data.user.name,
          ...userData  // This includes targetCal, protein, carbs, fat from health calculator
      }));

      // Pass user info + health data up to App
      onAuthSuccess({
        ...userData,
        userName: data.data.user?.name || name || userData?.userName || "User",
      });

    } catch (err) {
      setApiError("Could not connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: "100vh", color: C.text, display: "flex", flexDirection: "column" }}>

      {/* NAV */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", borderBottom: `0.5px solid ${C.border}` }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", letterSpacing: "2px", color: C.accent }}>INDI.FIT</span>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "13px" }}>
          ← Back
        </button>
      </nav>

      {/* BODY */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          {/* HEADER */}
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "36px", letterSpacing: "2px", color: C.text, marginBottom: "6px" }}>
              {mode === "signup" ? "Create Account" : "Welcome Back"}
            </h1>
            <p style={{ fontSize: "13px", color: C.muted }}>
              {mode === "signup"
                ? "Your macros are ready. Just save your account to start tracking."
                : "Log in to continue tracking your macros."}
            </p>
          </div>

          {/* CARD */}
          <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: "16px", padding: "1.8rem" }}>

            {/* TAB SWITCHER */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "1.8rem", background: C.surface, borderRadius: "10px", padding: "4px" }}>
              {["signup", "login"].map(m => (
                <button key={m}
                  onClick={() => { setMode(m); setErrors({}); setApiError(""); }}
                  style={{
                    background: mode === m ? C.accent : "transparent",
                    color:      mode === m ? "#0d0d0d" : C.muted,
                    border:     "none",
                    borderRadius: "7px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    padding: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textTransform: "capitalize",
                  }}>
                  {m === "signup" ? "Sign Up" : "Log In"}
                </button>
              ))}
            </div>

            {/* FIELDS */}
            {mode === "signup" && (
              <Field
                label="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ayush"
                error={errors.name}
              />
            )}
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              error={errors.email}
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              error={errors.password}
            />

            {/* API ERROR */}
            {apiError && (
              <div style={{ background: "rgba(255,79,79,0.08)", border: `0.5px solid rgba(255,79,79,0.25)`, borderRadius: "8px", padding: "10px 14px", marginBottom: "14px" }}>
                <p style={{ fontSize: "13px", color: C.red, margin: 0 }}>{apiError}</p>
              </div>
            )}

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "rgba(232,255,71,0.5)" : C.accent,
                color: "#0d0d0d",
                border: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                height: "46px",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.15s",
                marginTop: "4px",
              }}>
              {loading
                ? "Please wait..."
                : mode === "signup" ? "Create Account & Start Tracking →" : "Log In & Continue →"}
            </button>

            {/* SWITCH MODE */}
            <p style={{ fontSize: "12px", color: C.muted, textAlign: "center", marginTop: "16px" }}>
              {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
              <span
                onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setErrors({}); setApiError(""); }}
                style={{ color: C.accent, cursor: "pointer", fontWeight: 500 }}>
                {mode === "signup" ? "Log in" : "Sign up"}
              </span>
            </p>
          </div>

          {/* MACRO SUMMARY — show what they're about to save */}
          {userData && (
            <div style={{ marginTop: "1.2rem", background: C.accentDim, border: `0.5px solid ${C.accentBorder}`, borderRadius: "12px", padding: "1rem 1.2rem" }}>
              <p style={{ fontSize: "11px", color: C.accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", fontWeight: 600 }}>
                Your targets being saved
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", textAlign: "center" }}>
                {[
                  { label: "Calories", val: userData.targetCal,     unit: "kcal" },
                  { label: "Protein",  val: userData.protein, unit: "g"    },
                  { label: "Carbs",    val: userData.carbs,   unit: "g"    },
                  { label: "Fat",      val: userData.fat,     unit: "g"    },
                ].map(m => (
                  <div key={m.label}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "16px", fontWeight: 700, color: C.text }}>
                      {m.val}
                    </div>
                    <div style={{ fontSize: "10px", color: C.muted, marginTop: "2px" }}>{m.unit}</div>
                    <div style={{ fontSize: "10px", color: C.muted }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}