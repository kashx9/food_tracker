import { useState } from "react";
import './App.css';
import TrackerDashboard from "./TrackerDashboard";

const FOODS = [
  { name: "Paneer (100g)", protein: "18g P" },
  { name: "Chicken breast (100g)", protein: "31g P" },
  { name: "Whole egg", protein: "6g P" },
  { name: "Brown rice (1 cup)", protein: "5g P" },
  { name: "Dal (1 katori)", protein: "9g P" },
  { name: "Roti (1 medium)", protein: "3g P" },
  { name: "Curd (100g)", protein: "3.5g P" },
  { name: "Peanut butter (2 tbsp)", protein: "8g P" },
  { name: "Whey scoop", protein: "24g P" },
  { name: "Oats (50g)", protein: "6g P" },
  { name: "Maggi (1 packet)", protein: "7g P" },
  { name: "Chicken curry (1 bowl)", protein: "22g P" },
  { name: "+ 20 more", protein: null },
];

const STEPS = [
  {
    num: "01",
    title: "Pick your meal",
    desc: "Tap from a curated list of 30+ common Indian gym foods. Paneer, chicken, dal, roti, rice — all pre-loaded and accurate.",
  },
  {
    num: "02",
    title: "Adjust quantity",
    desc: 'Slider from 50g to 500g. Or tap "1 bowl / 1 roti / 1 serving" — we handle the math.',
  },
  {
    num: "03",
    title: "Macros calculated instantly",
    desc: 'Protein, carbs, fat — updated live. See your daily total at a glance. Save frequent meals as "my paneer pasta" etc.',
  },
  {
    num: "04",
    title: "Know if you're on track",
    desc: "Simple daily dashboard. Are you hitting your protein goal or not? No fluff, just your numbers.",
  },
];

const PAINS = [
  'You search "paneer bhurji" on MyFitnessPal — 47 results, none match what you ate',
  "You spend 10 minutes logging one meal and give up",
  'The app shows 300 "Indian foods" — all wrong quantities, all wrong',
  "You're bulking or cutting but tracking macros feels like a second job",
];

function EmailForm({ buttonLabel, successMsg }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.includes("@")) {
      setError(true);
      setTimeout(() => setError(false), 800);
      return;
    }

    setLoading(true);

    await fetch("https://formspree.io/f/mdapywqw", {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    setSubmitted(true);
    setEmail("");
  }

  return (
    <div>
      <div className="emailRow">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{
            borderColor: error ? "rgba(255,79,79,0.5)" : "rgba(255,255,255,0.15)",
          }}
          className="emailInput"
        />
        <button onClick={handleSubmit} className="emailBtn">
          {loading ? "Sending..." : buttonLabel}
        </button>
      </div>
      {submitted && <p className="successMsg">{successMsg}</p>}
    </div>
  );
}

function HealthCalculator() {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [showResults, setShowResults] = useState(false);
  const [bmi, setBmi] = useState(null);
  const [calories, setCalories] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState("maintain");

  function calculateHealth() {
    if (!height || !weight || !age) return;

    // BMI Calculation
    const heightM = height / 100;
    const bmiValue = weight / (heightM * heightM);
    setBmi(bmiValue.toFixed(1));

    // Harris-Benedict Formula for BMI
    let bmr;
    if (gender === "male") {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Activity multiplier
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * multipliers[activity];
    setCalories(Math.round(tdee));
    setShowResults(true);
  }

  function getHealthStatus(bmiValue) {
    if (bmiValue < 18.5) return { status: "Underweight", color: "#3b82f6", icon: "⬇️" };
    if (bmiValue < 25) return { status: "Healthy", color: "#10b981", icon: "✓" };
    if (bmiValue < 30) return { status: "Overweight", color: "#f59e0b", icon: "⚠️" };
    return { status: "Obese", color: "#ef4444", icon: "⚠️" };
  }

  function getGoalCalories() {
    if (!calories) return {};
    return {
      cut: Math.round(calories * 0.8),
      maintain: calories,
      bulk: Math.round(calories * 1.2),
    };
  }

  const healthStatus = bmi ? getHealthStatus(parseFloat(bmi)) : null;
  const goalCalories = getGoalCalories();

  return (
    <section style={{ paddingTop: "3rem", paddingBottom: "3rem" }} className="section">
      <h2 className="sectionHeading">Your Health Profile</h2>
      <p className="healthSubtitle">
        Tell us about yourself — we'll calculate your daily calorie needs and health range.
      </p>

      <div className="healthForm">
        <div className="formRow">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="formInput"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="formInput"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="formRow">
          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="formInput"
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="formInput"
          />
          <input
            type="number"
            placeholder="Age (years)"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="formInput"
          />
        </div>

        <div className="formRow">
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="formInput"
          >
            <option value="sedentary">Sedentary (little activity)</option>
            <option value="light">Light (1-3 days/week)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="veryActive">Very Active (2x/day)</option>
          </select>
        </div>

        <button onClick={calculateHealth} className="calcBtn">
          Calculate My Health
        </button>
      </div>

      {showResults && bmi && (
        <div className="resultsBox">
          <div className="resultCard">
            <h3 className="resultTitle">Your BMI</h3>
            <div style={{ color: healthStatus.color }} className="resultValue">
              {bmi}
            </div>
            <p className="resultStatus">
              {healthStatus.icon} {healthStatus.status}
            </p>
            <p className="resultHint">Healthy range: 18.5 - 24.9</p>
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
            <div
              className="goalCard"
              style={{
                borderColor:
                  selectedGoal === "cut"
                    ? "#3b82f6"
                    : "rgba(255,255,255,0.1)",
                background:
                  selectedGoal === "cut"
                    ? "rgba(59,130,246,0.1)"
                    : "rgba(255,255,255,0.03)",
              }}
              onClick={() => setSelectedGoal("cut")}
            >
              <h4 className="goalTitle">Cut (Lose Weight)</h4>
              <p className="goalCalories">{goalCalories.cut} cal/day</p>
              <p className="goalDesc">20% deficit</p>
            </div>

            <div
              className="goalCard"
              style={{
                borderColor:
                  selectedGoal === "maintain"
                    ? "#10b981"
                    : "rgba(255,255,255,0.1)",
                background:
                  selectedGoal === "maintain"
                    ? "rgba(16,185,129,0.1)"
                    : "rgba(255,255,255,0.03)",
              }}
              onClick={() => setSelectedGoal("maintain")}
            >
              <h4 className="goalTitle">Maintain</h4>
              <p className="goalCalories">{goalCalories.maintain} cal/day</p>
              <p className="goalDesc">Balanced</p>
            </div>

            <div
              className="goalCard"
              style={{
                borderColor:
                  selectedGoal === "bulk"
                    ? "#f59e0b"
                    : "rgba(255,255,255,0.1)",
                background:
                  selectedGoal === "bulk"
                    ? "rgba(245,158,11,0.1)"
                    : "rgba(255,255,255,0.03)",
              }}
              onClick={() => setSelectedGoal("bulk")}
            >
              <h4 className="goalTitle">Bulk (Gain)</h4>
              <p className="goalCalories">{goalCalories.bulk} cal/day</p>
              <p className="goalDesc">20% surplus</p>
            </div>
          </div>

          {/* <div className="tipBox">
            <h3 className="tipTitle">💡 Health Tip</h3>
            <p className="tipText">
              {bmi < 18.5
                ? "You're in the underweight range. Focus on gaining weight gradually with nutrient-dense foods and strength training."
                : bmi < 25
                ? "Great! You're in a healthy BMI range. Maintain this with consistent exercise and balanced nutrition."
                : bmi < 30
                ? "You're in the overweight range. Consider a moderate calorie deficit with regular exercise to reach a healthier BMI."
                : "You're in the obese range. Consult with a healthcare provider for personalized guidance on nutrition and fitness."}
            </p>
          </div> */}
          <div className="actionButtons">
            <button className="actionButton" onClick={() => alert('Enter your target calories functionality - navigate to calorie entry page')}>
              Enter your target calories
            </button>
            <button className="actionButton" onClick={() => alert('Start tracking calories - navigate to tracking page')}>
              Start tracking calories
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// export default function IndiFitLanding() {
//   return (
//     <div className="page">
//       {/* NAV */}
//       <nav className="nav">
//         <span className="logo">INDI.FIT</span>
//         <span className="navBadge">Early Access</span>
//       </nav>

//       {/* HERO */}
//       <div className="hero">
//         <span className="heroTag">Built for Indian gym goers</span>
//         <h1 className="h1">
//           Track macros
//           <span className="accent"> without the BS</span>
//         </h1>
//         <p className="heroSub">
//           MyFitnessPal doesn't know what <strong className="strong">dal makhani</strong> is.
//           <br />
//           We do. Paneer. Roti. Chicken rice. All in there —{" "}
//           <strong className="strong">in seconds.</strong>
//         </p>
//         <p className="trustLine">Free to try. No app download needed.</p>
//       </div>

//       <div className="divider" />

//       {/* PAIN */}
//       <section className="section">
//         <h2 className="sectionHeading">Sound familiar?</h2>
//         <ul className="painList">
//           {PAINS.map((pain, i) => (
//             <li key={i} className="painItem">
//               <span className="xMark">✕</span>
//               <span>{pain}</span>
//             </li>
//           ))}
//         </ul>
//       </section>

//       <div className="divider" />

//       {/* HOW IT WORKS */}
//       <section className="section">
//         <h2 className="sectionHeading">How it works</h2>
//         <div>
//           {STEPS.map((step, i) => (
//             <div
//               key={i}
//               className="step"
//               style={{
//                 borderBottom:
//                   i < STEPS.length - 1
//                     ? "0.5px solid rgba(255,255,255,0.06)"
//                     : "none",
//               }}
//             >
//               <div className="stepNum">{step.num}</div>
//               <div>
//                 <h3 className="stepTitle">{step.title}</h3>
//                 <p className="stepDesc">{step.desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <div className="divider" />

//       {/* HEALTH CALCULATOR */}
//       <HealthCalculator />

//       <div className="divider" />

//       {/* FOOD CHIPS */}
//       <section className="section" style={{ paddingBottom: "3rem" }}>
//         <h2 className="sectionHeading">Foods already in there</h2>
//         <div className="chipGrid">
//           {FOODS.map((food, i) => (
//             <div key={i} className="chip">
//               {food.name}
//               {food.protein && (
//                 <span className="chipMacro">{food.protein}</span>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA FOOTER */}
//       <div className="ctaFooter">
//         <h2 style={{ fontSize: "32px", marginBottom: "0.4rem" }} className="sectionHeading">
//           Want early access?
//         </h2>
//         <p className="ctaSubtext">
//           Drop your email — we'll let you in first when it's ready.
//         </p>
//         <div style={{ maxWidth: 440, margin: "0 auto" }}>
//           <EmailForm
//             buttonLabel="Notify Me"
//             successMsg="Locked in. You'll hear from us first."
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

export default function App(){
  return <TrackerDashboard/>
}

const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#0d0d0d",
    color: "#f0ede6",
    minHeight: "100vh",
    overflowX: "hidden",
  },

  /* NAV */
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.2rem 2rem",
    borderBottom: "0.5px solid rgba(255,255,255,0.08)",
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "22px",
    letterSpacing: "2px",
    color: "#e8ff47",
  },
  navBadge: {
    fontSize: "11px",
    fontWeight: 500,
    background: "rgba(232,255,71,0.12)",
    color: "#e8ff47",
    border: "0.5px solid rgba(232,255,71,0.3)",
    padding: "4px 12px",
    borderRadius: "20px",
  },

  /* HERO */
  hero: {
    padding: "4rem 2rem 3rem",
    maxWidth: "680px",
    margin: "0 auto",
    textAlign: "center",
  },
  heroTag: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: 500,
    background: "rgba(255,255,255,0.06)",
    border: "0.5px solid rgba(255,255,255,0.12)",
    color: "#a0a09a",
    padding: "5px 14px",
    borderRadius: "20px",
    marginBottom: "1.8rem",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  h1: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(52px, 10vw, 84px)",
    lineHeight: 0.95,
    letterSpacing: "2px",
    color: "#f0ede6",
    marginBottom: "0.5rem",
  },
  accent: {
    color: "#e8ff47",
    display: "block",
  },
  heroSub: {
    fontSize: "15px",
    color: "#7a7a72",
    margin: "1.4rem auto 0",
    lineHeight: 1.7,
    maxWidth: "480px",
  },
  strong: {
    color: "#f0ede6",
    fontWeight: 500,
  },
  trustLine: {
    fontSize: "12px",
    color: "#555",
    marginTop: "10px",
  },
  successMsg: {
    fontSize: "13px",
    color: "#e8ff47",
    marginTop: "8px",
  },

  /* EMAIL FORM */
  emailRow: {
    display: "flex",
    gap: "8px",
    marginTop: "2.4rem",
    flexWrap: "wrap",
  },
  emailInput: {
    flex: 1,
    minWidth: "180px",
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.15)",
    color: "#f0ede6",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    padding: "0 16px",
    height: "46px",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  emailBtn: {
    background: "#e8ff47",
    color: "#0d0d0d",
    border: "none",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    padding: "0 20px",
    height: "46px",
    borderRadius: "8px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  /* DIVIDER */
  divider: {
    height: "0.5px",
    background: "rgba(255,255,255,0.07)",
    margin: "0 2rem",
  },

  /* SECTIONS */
  section: {
    padding: "3rem 2rem",
    maxWidth: "680px",
    margin: "0 auto",
  },
  sectionHeading: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "28px",
    letterSpacing: "1.5px",
    color: "#f0ede6",
    marginBottom: "1.2rem",
  },

  /* PAIN */
  painList: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  painItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    fontSize: "14px",
    color: "#7a7a72",
    lineHeight: 1.5,
    padding: "12px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "0.5px solid rgba(255,255,255,0.07)",
    borderRadius: "8px",
  },
  xMark: {
    color: "#ff4f4f",
    fontSize: "16px",
    flexShrink: 0,
  },

  /* STEPS */
  step: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    padding: "16px 0",
  },
  stepNum: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    color: "#e8ff47",
    background: "rgba(232,255,71,0.1)",
    border: "0.5px solid rgba(232,255,71,0.2)",
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "2px",
  },
  stepTitle: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#f0ede6",
    marginBottom: "3px",
  },
  stepDesc: {
    fontSize: "13px",
    color: "#6a6a62",
    lineHeight: 1.5,
  },

  /* HEALTH CALCULATOR */
  healthSubtitle: {
    fontSize: "14px",
    color: "#7a7a72",
    marginBottom: "1.8rem",
    lineHeight: 1.6,
  },
  healthForm: {
    background: "rgba(255,255,255,0.03)",
    border: "0.5px solid rgba(255,255,255,0.07)",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "1.8rem",
  },
  formRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  formInput: {
    flex: 1,
    minWidth: "140px",
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.12)",
    color: "#f0ede6",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    padding: "10px 12px",
    borderRadius: "6px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  calcBtn: {
    width: "100%",
    background: "#e8ff47",
    color: "#0d0d0d",
    border: "none",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    padding: "12px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  resultsBox: {
    display: "flex",
    gap: "16px",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  resultCard: {
    flex: 1,
    minWidth: "200px",
    background: "rgba(255,255,255,0.03)",
    border: "0.5px solid rgba(255,255,255,0.07)",
    borderRadius: "8px",
    padding: "1.5rem",
    textAlign: "center",
  },
  resultTitle: {
    fontSize: "13px",
    color: "#7a7a72",
    fontWeight: 500,
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  resultValue: {
    fontSize: "32px",
    fontFamily: "'DM Mono', monospace",
    fontWeight: 600,
    marginBottom: "4px",
  },
  resultStatus: {
    fontSize: "13px",
    color: "#f0ede6",
    fontWeight: 500,
    marginBottom: "4px",
  },
  resultHint: {
    fontSize: "12px",
    color: "#6a6a62",
  },
  goalsHeading: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#f0ede6",
    marginBottom: "1rem",
    marginTop: "2rem",
  },
  goalsGrid: {
    display: "flex",
    gap: "12px",
    marginBottom: "1.8rem",
    flexWrap: "wrap",
  },
  goalCard: {
    flex: 1,
    minWidth: "140px",
    padding: "1rem",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  goalTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#f0ede6",
    marginBottom: "6px",
  },
  goalCalories: {
    fontSize: "18px",
    fontFamily: "'DM Mono', monospace",
    color: "#e8ff47",
    fontWeight: 600,
    marginBottom: "2px",
  },
  goalDesc: {
    fontSize: "12px",
    color: "#6a6a62",
  },
  tipBox: {
    background: "rgba(232,255,71,0.05)",
    border: "0.5px solid rgba(232,255,71,0.15)",
    borderRadius: "8px",
    padding: "1.2rem",
  },
  tipTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#e8ff47",
    marginBottom: "8px",
  },
  tipText: {
    fontSize: "13px",
    color: "#7a7a72",
    lineHeight: 1.6,
  },

  /* CHIPS */
  chipGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  chip: {
    fontSize: "13px",
    padding: "6px 14px",
    borderRadius: "20px",
    border: "0.5px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "#b0afa8",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  chipMacro: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    color: "#e8ff47",
  },

  /* CTA FOOTER */
  ctaFooter: {
    background: "rgba(232,255,71,0.04)",
    borderTop: "0.5px solid rgba(232,255,71,0.12)",
    padding: "3rem 2rem",
    textAlign: "center",
  },
  ctaSubtext: {
    fontSize: "13px",
    color: "#6a6a62",
    marginBottom: "1.8rem",
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginTop: '20px',
    flexWrap: 'wrap', // Allows wrapping on smaller screens
  },
  actionButton: {
    backgroundColor: '#FFD700',
    color: '#000',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    minWidth: '200px', // Ensures consistent button width
  },
};