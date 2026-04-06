import { useState } from "react";

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

// function EmailForm({ inputId, buttonLabel, successMsg }) {
//   const [email, setEmail] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState(false);

//   function handleSubmit() {
//     if (email.includes("@")) {
//       setSubmitted(true);
//       setEmail("");
//       setError(false);
//     } else {
//       setError(true);
//       setTimeout(() => setError(false), 800);
//     }
//   }

//   return (
//     <div>
//       <div style={styles.emailRow}>
//         <input
//           id={inputId}
//           type="email"
//           placeholder="your@email.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//           style={{
//             ...styles.emailInput,
//             borderColor: error ? "rgba(255,79,79,0.5)" : "rgba(255,255,255,0.15)",
//           }}
//         />
//         <button onClick={handleSubmit} style={styles.emailBtn}>
//           {buttonLabel}
//         </button>
//       </div>
//       {submitted && (
//         <p style={styles.successMsg}>{successMsg}</p>
//       )}
//     </div>
//   );
// }

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
      <div style={styles.emailRow}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{
            ...styles.emailInput,
            borderColor: error ? "rgba(255,79,79,0.5)" : "rgba(255,255,255,0.15)",
          }}
        />
        <button onClick={handleSubmit} style={styles.emailBtn}>
          {loading ? "Sending..." : buttonLabel}
        </button>
      </div>
      {submitted && <p style={styles.successMsg}>{successMsg}</p>}
    </div>
  );
}

export default function IndiFitLanding() {
  return (
    <div style={styles.page}>
      {/* NAV */}
      <nav style={styles.nav}>
        <span style={styles.logo}>INDI.FIT</span>
        <span style={styles.navBadge}>Early Access</span>
      </nav>

      {/* HERO */}
      <div style={styles.hero}>
        <span style={styles.heroTag}>Built for Indian gym goers</span>
        <h1 style={styles.h1}>
          Track macros
          <span style={styles.accent}> without the BS</span>
        </h1>
        <p style={styles.heroSub}>
          MyFitnessPal doesn't know what <strong style={styles.strong}>dal makhani</strong> is.
          <br />
          We do. Paneer. Roti. Chicken rice. All in there —{" "}
          <strong style={styles.strong}>in seconds.</strong>
        </p>
        <EmailForm
          inputId="hero-email"
          buttonLabel="Get Early Access"
          successMsg="You're in. We'll ping you when it's live."
        />
        <p style={styles.trustLine}>Free to try. No app download needed.</p>
      </div>

      <div style={styles.divider} />

      {/* PAIN */}
      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Sound familiar?</h2>
        <ul style={styles.painList}>
          {PAINS.map((pain, i) => (
            <li key={i} style={styles.painItem}>
              <span style={styles.xMark}>✕</span>
              <span>{pain}</span>
            </li>
          ))}
        </ul>
      </section>

      <div style={styles.divider} />

      {/* HOW IT WORKS */}
      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>How it works</h2>
        <div>
          {STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                ...styles.step,
                borderBottom:
                  i < STEPS.length - 1
                    ? "0.5px solid rgba(255,255,255,0.06)"
                    : "none",
              }}
            >
              <div style={styles.stepNum}>{step.num}</div>
              <div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.divider} />

      {/* FOOD CHIPS */}
      <section style={{ ...styles.section, paddingBottom: "3rem" }}>
        <h2 style={styles.sectionHeading}>Foods already in there</h2>
        <div style={styles.chipGrid}>
          {FOODS.map((food, i) => (
            <div key={i} style={styles.chip}>
              {food.name}
              {food.protein && (
                <span style={styles.chipMacro}>{food.protein}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <div style={styles.ctaFooter}>
        <h2 style={{ ...styles.sectionHeading, fontSize: "32px", marginBottom: "0.4rem" }}>
          Want early access?
        </h2>
        <p style={styles.ctaSubtext}>
          Drop your email — we'll let you in first when it's ready.
        </p>
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <EmailForm
            inputId="footer-email"
            buttonLabel="Notify Me"
            successMsg="Locked in. You'll hear from us first."
          />
        </div>
      </div>
    </div>
  );
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
};