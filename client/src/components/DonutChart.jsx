import { C } from "../utils/constants";
import "./DonutChart.css";

export function DonutChart({ consumed, target }) {
  const pct  = Math.min(consumed / target, 1);
  const r    = 54;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const over = consumed > target;

  return (
    <div className="donut-wrapper">
      <svg width="140" height="140" className="donut-svg">
        <circle cx="70" cy="70" r={r} fill="none" stroke={C.dim} strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none"
          stroke={over ? C.red : C.accent} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
      <div className="donut-center">
        <span className={`donut-cal${over ? " donut-cal--over" : ""}`}>
          {Math.round(consumed)}
        </span>
        <span className="donut-target">/ {target} cal</span>
      </div>
    </div>
  );
}
