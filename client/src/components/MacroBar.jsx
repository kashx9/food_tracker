import "./MacroBar.css";

export function MacroBar({ label, consumed, target, color }) {
  const pct = Math.min((consumed / target) * 100, 100);
  return (
    <div className="macro-bar">
      <div className="macro-bar-row">
        <span className="macro-bar-label">{label}</span>
        <span className="macro-bar-value">
          {Math.round(consumed)}g <span className="macro-bar-muted">/ {target}g</span>
        </span>
      </div>
      <div className="macro-bar-track">
        <div className="macro-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
