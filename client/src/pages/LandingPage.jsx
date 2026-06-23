import '../App.css';
import { useNavigate } from 'react-router-dom';
import { FOODS, STEPS, PAINS } from "../utils/constants";

export default function LandingPage() {
  const navigate = useNavigate();
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
        <div className="actionButtons">
          <button className="actionButton" onClick={() => navigate("/auth")}>Start Tracking →</button>
        </div>
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
            <div key={i} className={`step${i < STEPS.length - 1 ? " step--bordered" : ""}`}>
              <div className="stepNum">{step.num}</div>
              <div><h3 className="stepTitle">{step.title}</h3><p className="stepDesc">{step.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      <section className="section">
        <h2 className="sectionHeading">Foods already in there</h2>
        <div className="chipGrid">
          {FOODS.map((food, i) => (
            <div key={i} className="chip">
              {food.name}{food.protein && <span className="chipMacro">{food.protein}</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
