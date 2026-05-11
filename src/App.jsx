import { useState,useEffect } from "react";
import './App.css';
import TrackerDashboard from "./TrackerDashboard";
import AuthScreen from "./AuthScreen";

function getMacros(calories, goal, weightKg) {
  const splits = {
    cut:      { protein: 0.40, carbs: 0.35, fat: 0.25 },
    maintain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
    bulk:     { protein: 0.25, carbs: 0.50, fat: 0.25 },
  };
  const split = splits[goal];
  const proteinFromPct = Math.round((calories * split.protein) / 4);
  const proteinFloor   = Math.round(weightKg * 1.6);
  return {
    protein: Math.max(proteinFromPct, proteinFloor),
    carbs:   Math.round((calories * split.carbs) / 4),
    fat:     Math.round((calories * split.fat)   / 9),
  };
}

const FOODS = [
  { name: "Paneer (100g)",         protein: "18g P"  },
  { name: "Chicken breast (100g)", protein: "31g P"  },
  { name: "Whole egg",             protein: "6g P"   },
  { name: "Brown rice (1 cup)",    protein: "5g P"   },
  { name: "Dal (1 katori)",        protein: "9g P"   },
  { name: "Roti (1 medium)",       protein: "3g P"   },
  { name: "Curd (100g)",           protein: "3.5g P" },
  { name: "Peanut butter (2 tbsp)",protein: "8g P"   },
  { name: "Whey scoop",            protein: "24g P"  },
  { name: "Oats (50g)",            protein: "6g P"   },
  { name: "Maggi (1 packet)",      protein: "7g P"   },
  { name: "Chicken curry (1 bowl)",protein: "22g P"  },
  { name: "+ 20 more",             protein: null     },
];

const STEPS = [
  { num: "01", title: "Pick your meal",              desc: "Tap from a curated list of 30+ common Indian gym foods. Paneer, chicken, dal, roti, rice — all pre-loaded and accurate." },
  { num: "02", title: "Adjust quantity",             desc: 'Slider from 50g to 500g. Or tap "1 bowl / 1 roti / 1 serving" — we handle the math.' },
  { num: "03", title: "Macros calculated instantly", desc: 'Protein, carbs, fat — updated live. See your daily total at a glance. Save frequent meals as "my paneer pasta" etc.' },
  { num: "04", title: "Know if you're on track",     desc: "Simple daily dashboard. Are you hitting your protein goal or not? No fluff, just your numbers." },
];

const PAINS = [
  'You search "paneer bhurji" on MyFitnessPal — 47 results, none match what you ate',
  "You spend 10 minutes logging one meal and give up",
  'The app shows 300 "Indian foods" — all wrong quantities, all wrong',
  "You're bulking or cutting but tracking macros feels like a second job",
];

// ─────────────────────────────────────────────
function EmailForm({ buttonLabel, successMsg }) {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState(false);
  const [loading, setLoading]     = useState(false);

  async function handleSubmit() {
    if (!email.includes("@")) { setError(true); setTimeout(() => setError(false), 800); return; }
    setLoading(true);
    await fetch("https://formspree.io/f/mdapywqw", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
    });
    setLoading(false); setSubmitted(true); setEmail("");
  }

  return (
    <div>
      <div className="emailRow">
        <input type="email" placeholder="your@email.com" value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={{ borderColor: error ? "rgba(255,79,79,0.5)" : "rgba(255,255,255,0.15)" }}
          className="emailInput" />
        <button onClick={handleSubmit} className="emailBtn">{loading ? "Sending..." : buttonLabel}</button>
      </div>
      {submitted && <p className="successMsg">{successMsg}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
function HealthCalculator({ onStartTracking }) {
  const [name,         setName]         = useState("");
  const [height,       setHeight]       = useState("");
  const [weight,       setWeight]       = useState("");
  const [age,          setAge]          = useState("");
  const [gender,       setGender]       = useState("male");
  const [activity,     setActivity]     = useState("moderate");
  const [showResults,  setShowResults]  = useState(false);
  const [bmi,          setBmi]          = useState(null);
  const [calories,     setCalories]     = useState(null);
  const [selectedGoal, setSelectedGoal] = useState("maintain");
  const [useCustomCal, setUseCustomCal] = useState(false);
  const [customCal,    setCustomCal]    = useState("");

  function calculateHealth() {
    if (!height || !weight || !age) return;
    const heightM  = height / 100;
    setBmi((weight / (heightM * heightM)).toFixed(1));
    let bmr = gender === "male"
      ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
    setCalories(Math.round(bmr * multipliers[activity]));
    setShowResults(true);

    setTimeout(() => {
    document.getElementById("calc-results")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
  }

  function getHealthStatus(v) {
    if (v < 18.5) return { status: "Underweight", color: "#3b82f6", icon: "⬇️" };
    if (v < 25)   return { status: "Healthy",     color: "#10b981", icon: "✓"  };
    if (v < 30)   return { status: "Overweight",  color: "#f59e0b", icon: "⚠️" };
    return               { status: "Obese",        color: "#ef4444", icon: "⚠️" };
  }

  function getGoalCalories() {
    if (!calories) return {};
    return { cut: Math.round(calories * 0.8), maintain: calories, bulk: Math.round(calories * 1.2) };
  }

  function handleStartTracking() {
    const weightKg = parseFloat(weight) || 70;
    const finalCal = useCustomCal && customCal ? parseInt(customCal) : getGoalCalories()[selectedGoal];
    const macros   = getMacros(finalCal, selectedGoal, weightKg);
    onStartTracking({ userName: name || "User", targetCal: finalCal, ...macros });
  }

  const healthStatus = bmi ? getHealthStatus(parseFloat(bmi)) : null;
  const goalCalories = getGoalCalories();

  return (
    <section style={{ paddingTop: "3rem", paddingBottom: "3rem" }} className="section">
      <h2 className="sectionHeading">Your Health Profile</h2>
      <p className="healthSubtitle">Tell us about yourself — we'll calculate your daily calorie needs and health range.</p>

      <div className="healthForm">
        <div className="formRow">
          <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="formInput" />
          <select value={gender} onChange={e => setGender(e.target.value)} className="formInput">
            <option value="male">Male</option><option value="female">Female</option>
          </select>
        </div>
        <div className="formRow">
          <input type="number" placeholder="Height (cm)" value={height} onChange={e => setHeight(e.target.value)} className="formInput" />
          <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} className="formInput" />
          <input type="number" placeholder="Age (years)" value={age}    onChange={e => setAge(e.target.value)}    className="formInput" />
        </div>
        <div className="formRow">
          <select value={activity} onChange={e => setActivity(e.target.value)} className="formInput">
            <option value="sedentary">Sedentary (little activity)</option>
            <option value="light">Light (1-3 days/week)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="veryActive">Very Active (2x/day)</option>
          </select>
        </div>
        <button onClick={calculateHealth} className="calcBtn">Calculate My Health</button>
      </div>

      {showResults && bmi && (
        <div id="calc-results" className="resultsBox">
          <div className="resultCard">
            <h3 className="resultTitle">Your BMI</h3>
            <div style={{ color: healthStatus.color }} className="resultValue">{bmi}</div>
            <p className="resultStatus">{healthStatus.icon} {healthStatus.status}</p>
            <p className="resultHint">Healthy range: 18.5 – 24.9</p>
          </div>
          <div className="resultCard">
            <h3 className="resultTitle">Daily Calories</h3>
            <div className="resultValue">{calories}</div>
            <p className="resultStatus">Maintenance level</p>
            <p className="resultHint">Based on your activity level</p>
          </div>
        </div>
      )}

      {showResults && calories && (
        <div>
          <h3 className="goalsHeading">Choose Your Goal</h3>
          <div className="goalsGrid">
            {[
              { key: "cut",      label: "Cut (Lose Weight)", cal: goalCalories.cut,      desc: "20% deficit", color: "#3b82f6" },
              { key: "maintain", label: "Maintain",          cal: goalCalories.maintain, desc: "Balanced",    color: "#10b981" },
              { key: "bulk",     label: "Bulk (Gain)",       cal: goalCalories.bulk,     desc: "20% surplus", color: "#f59e0b" },
            ].map(g => (
              <div key={g.key} className="goalCard"
                style={{ borderColor: selectedGoal === g.key ? g.color : "rgba(255,255,255,0.1)", background: selectedGoal === g.key ? `${g.color}18` : "rgba(255,255,255,0.03)" }}
                onClick={() => { setSelectedGoal(g.key); setUseCustomCal(false); }}>
                <h4 className="goalTitle">{g.label}</h4>
                <p  className="goalCalories">{g.cal} cal/day</p>
                <p  className="goalDesc">{g.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "16px", marginBottom: "8px" }}>
            <button onClick={() => setUseCustomCal(v => !v)} style={{
              background: useCustomCal ? "rgba(232,255,71,0.12)" : "rgba(255,255,255,0.04)",
              border: `0.5px solid ${useCustomCal ? "rgba(232,255,71,0.3)" : "rgba(255,255,255,0.1)"}`,
              color: useCustomCal ? "#e8ff47" : "#a0a09a",
              fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500,
              padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
            }}>
              {useCustomCal ? "✓ Using custom calories" : "Enter my own target calories instead"}
            </button>
          </div>

          {useCustomCal && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", marginTop: "8px" }}>
              <input type="number" placeholder="e.g. 2200" value={customCal}
                onChange={e => setCustomCal(e.target.value)} className="formInput" style={{ maxWidth: "180px" }} />
              <span style={{ fontSize: "13px", color: "#6a6a62" }}>cal / day</span>
            </div>
          )}

          {(() => {
            const finalCal = useCustomCal && customCal ? parseInt(customCal) : goalCalories[selectedGoal];
            if (!finalCal) return null;
            const m = getMacros(finalCal, selectedGoal, parseFloat(weight) || 70);
            return (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "20px", marginTop: "4px" }}>
                {[
                  { label: "Protein", val: m.protein, color: "#4ade80" },
                  { label: "Carbs",   val: m.carbs,   color: "#60a5fa" },
                  { label: "Fat",     val: m.fat,     color: "#f97316" },
                ].map(macro => (
                  <div key={macro.label} style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: 600, color: macro.color, fontFamily: "'DM Mono', monospace" }}>{macro.val}g</div>
                    <div style={{ fontSize: "11px", color: "#6a6a62", marginTop: "3px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{macro.label}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          <div className="actionButtons">
            <button className="actionButton" onClick={handleStartTracking}>Start Tracking →</button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
function IndiFitLanding({ onStartTracking }) {
  return (
    <div className="page">
      <nav className="nav">
        <span className="logo">INDI.FIT</span>
        <span className="navBadge">Early Access</span>
      </nav>

      <div className="hero">
        <span className="heroTag">Built for Indian gym goers</span>
        <h1 className="h1">Track macros<span className="accent"> without the BS</span></h1>
        <p className="heroSub">
          MyFitnessPal doesn't know what <strong className="strong">dal makhani</strong> is.<br />
          We do. Paneer. Roti. Chicken rice. All in there — <strong className="strong">in seconds.</strong>
        </p>
        <p className="trustLine">Free to try. No app download needed.</p>
      </div>

      <div className="divider" />

      <section className="section">
        <h2 className="sectionHeading">Sound familiar?</h2>
        <ul className="painList">
          {PAINS.map((pain, i) => (
            <li key={i} className="painItem"><span className="xMark">✕</span><span>{pain}</span></li>
          ))}
        </ul>
      </section>

      <div className="divider" />

      <section className="section">
        <h2 className="sectionHeading">How it works</h2>
        <div>
          {STEPS.map((step, i) => (
            <div key={i} className="step"
              style={{ borderBottom: i < STEPS.length - 1 ? "0.5px solid rgba(255,255,255,0.06)" : "none" }}>
              <div className="stepNum">{step.num}</div>
              <div><h3 className="stepTitle">{step.title}</h3><p className="stepDesc">{step.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />
      <HealthCalculator onStartTracking={onStartTracking} />
      <div className="divider" />

      <section className="section" style={{ paddingBottom: "3rem" }}>
        <h2 className="sectionHeading">Foods already in there</h2>
        <div className="chipGrid">
          {FOODS.map((food, i) => (
            <div key={i} className="chip">
              {food.name}{food.protein && <span className="chipMacro">{food.protein}</span>}
            </div>
          ))}
        </div>
      </section>

      <div className="ctaFooter">
        <h2 style={{ fontSize: "32px", marginBottom: "0.4rem" }} className="sectionHeading">Want early access?</h2>
        <p className="ctaSubtext">Drop your email — we'll let you in first when it's ready.</p>
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <EmailForm buttonLabel="Notify Me" successMsg="Locked in. You'll hear from us first." />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Flow: landing → auth → tracker
// ─────────────────────────────────────────────
export default function App() {
  const [page,     setPage]     = useState("landing");
  const [userData, setUserData] = useState(null);
  const [authMode, setAuthMode] = useState("signup");

  function handleLogout() {
    // Only clear auth token, preserve health metrics
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
    setAuthMode("login");
    setPage("auth"); // Go to auth, not landing
  }

  // NEW: Check localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      const user = JSON.parse(savedUser);
      // Restore ALL fields — health metrics were spread into user on auth success
      setUserData({
        userName: user.name || user.userName || "User",
        targetCal: user.targetCal,
        protein:   user.protein,
        carbs:     user.carbs,
        fat:       user.fat,
      });
      setPage("tracker");
    }
  }, []);

  // Health calculator done → show auth screen
  function handleStartTracking(data) {
    // Store health metrics persistently so they survive logout
    localStorage.setItem("healthMetrics", JSON.stringify({
      userName: data.userName,
      targetCal: data.targetCal,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
    }));
    setUserData(data);
    setAuthMode("signup");
    setPage("auth");
  }

  // Auth success → show tracker with all data
  function handleAuthSuccess(data) {
    setUserData(data);
    setPage("tracker");
  }

  if (page === "auth") {
    // Always show auth screen when page is auth.
    // Use persisted health metrics on logout so the form still has the last targets.
    const savedHealthMetrics = localStorage.getItem("healthMetrics");
    const healthData = savedHealthMetrics ? JSON.parse(savedHealthMetrics) : userData;

    return (
      <AuthScreen
        userData={healthData}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setPage("landing")}
      />
    );
  }

  if (page === "tracker" && !userData) {
    const savedHealthMetrics = localStorage.getItem("healthMetrics");
    const healthData = savedHealthMetrics ? JSON.parse(savedHealthMetrics) : null;

    return (
      <AuthScreen
        userData={healthData}
        initialMode="login"
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setPage("landing")}
      />
    );
  }

  if (page === "tracker" && userData) {
    return (
      <TrackerDashboard
        userName={userData.userName}
        targetCal={userData.targetCal}
        targetProtein={userData.protein}
        targetCarbs={userData.carbs}
        targetFat={userData.fat}
        onLogout={handleLogout}
      />
    );
  }

  return <IndiFitLanding onStartTracking={handleStartTracking} />;
}