import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { NavBar } from "../components/NavBar";
import { login, register } from "../utils/api";
import "./AuthScreen.css";

function Field({ label, type = "text", value, onChange, placeholder, error }) {
  return (
    <div className="field-wrapper">
      <label className="field-label">{label}</label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`field-input${error ? " field-input--error" : ""}`}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export default function AuthScreen() {
  const { login: authLogin } = useAuth();
  const navigate             = useNavigate();
  const [searchParams]       = useSearchParams();

  const [mode,     setMode]     = useState(searchParams.get("mode") || "signup");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState("");

  function validate() {
    const e = {};
    if (mode === "signup" && !name.trim()) e.name     = "Name is required";
    if (!email.includes("@"))              e.email    = "Enter a valid email";
    if (password.length < 6)              e.password = "Password must be at least 6 characters";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setApiError("");
    setLoading(true);

    try {
      const res  = mode === "signup"
        ? await register(name, email, password)
        : await login(email, password);
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Something went wrong. Try again.");
        setLoading(false);
        return;
      }

      const user = data.data.user;
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify({
        userId:   user._id,
        email:    user.email,
        name:     user.name,
        calories: user.calories,
        protein:  user.protein,
        carbs:    user.carbs,
        fat:      user.fat,
      }));

      authLogin({
        userId:    user._id,
        userName:  user.name,
        email:     user.email,
        targetCal: user.calories,
        protein:   user.protein,
        carbs:     user.carbs,
        fat:       user.fat,
      });

      if (mode === "signup") {
        navigate("/health-setup");
      } else {
        navigate(user.calories ? "/tracker" : "/health-setup");
      }

    } catch {
      setApiError("Could not connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <NavBar onBack={() => navigate("/")} />
      <div className="auth-center-body">
        <div className="auth-right">
          <div className="auth-form-wrapper">

            <div className="auth-header">
              <h1 className="auth-title">
                {mode === "signup" ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="auth-subtitle">
                {mode === "signup"
                  ? "Sign up, then set your daily targets."
                  : "Log in to continue tracking your macros."}
              </p>
            </div>

            <div className="auth-card">
              <div className="auth-tab-grid">
                {["signup", "login"].map(m => (
                  <button key={m}
                    onClick={() => { setMode(m); setErrors({}); setApiError(""); }}
                    className={`auth-tab${mode === m ? " auth-tab--active" : ""}`}>
                    {m === "signup" ? "Sign Up" : "Log In"}
                  </button>
                ))}
              </div>

              {mode === "signup" && (
                <Field label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Ayush" error={errors.name} />
              )}
              <Field label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" error={errors.email} />
              <Field label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" error={errors.password} />

              {apiError && (
                <div className="auth-api-error">
                  <p>{apiError}</p>
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading} className="auth-submit-btn">
                {loading ? "Please wait..." : mode === "signup" ? "Create Account →" : "Log In →"}
              </button>

              <p className="auth-toggle-text">
                {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
                <span
                  onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setErrors({}); setApiError(""); }}
                  className="auth-toggle-link">
                  {mode === "signup" ? "Log in" : "Sign up"}
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
