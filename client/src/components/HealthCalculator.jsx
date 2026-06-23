import {useState} from "react";
import { getMacros} from '../utils/GetMacros.js';
import "./HealthCalculator.css";

export function HealthCalculator({ onStartTracking }) {
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
    <section className="section">
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

          {useCustomCal && (
            <div className="custom-cal-row">
              <input type="number" placeholder="e.g. 2200" value={customCal}
                onChange={e => setCustomCal(e.target.value)} className="formInput custom-cal-input" />
              <span className="custom-cal-unit">cal / day</span>
            </div>
          )}

          {(() => {
            const finalCal = useCustomCal && customCal ? parseInt(customCal) : goalCalories[selectedGoal];
            if (!finalCal) return null;
            const m = getMacros(finalCal, selectedGoal, parseFloat(weight) || 70);
            return (
              <div className="macro-preview-grid">
                {[
                  { label: "Protein", val: m.protein, color: "#4ade80" },
                  { label: "Carbs",   val: m.carbs,   color: "#60a5fa" },
                  { label: "Fat",     val: m.fat,     color: "#f97316" },
                ].map(macro => (
                  <div key={macro.label} className="macro-preview-item">
                    <div className="macro-preview-val" style={{ color: macro.color }}>{macro.val}g</div>
                    <div className="macro-preview-label">{macro.label}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
}
