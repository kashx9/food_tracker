import { useState } from "react";
import "./MealSection.css";

export function MealSection({ title, items, onAddClick, onRemove, onCreateClick }) {
  const [open, setOpen] = useState(true);

  const totals = items.reduce((acc, i) => ({
    cal:     acc.cal     + i.cal,
    protein: acc.protein + i.protein,
    carbs:   acc.carbs   + i.carbs,
    fat:     acc.fat     + i.fat,
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="meal-section">
      <div
        className={`meal-header${items.length > 0 && open ? " meal-header--bordered" : ""}`}
        onClick={() => setOpen(o => !o)}
      >
        <div className="meal-header-left">
          <span className="meal-collapse-arrow">{open ? "▾" : "▸"}</span>
          <span className="meal-title">{title}</span>
          {items.length > 0 && (
            <span className="meal-header-macros">
              <span className="meal-protein">{Math.round(totals.protein)}p</span>
              {" · "}
              <span className="meal-carbs">{Math.round(totals.carbs)}c</span>
              {" · "}
              <span className="meal-fat">{Math.round(totals.fat)}f</span>
            </span>
          )}
        </div>
        <div className="meal-header-right" onClick={e => e.stopPropagation()}>
          {items.length > 0 && (
            <span className="meal-cal-badge">{Math.round(totals.cal)} cal</span>
          )}
          <button onClick={onCreateClick} className="meal-create-btn">Create</button>
          <button onClick={onAddClick} className="meal-add-btn">+ Add</button>
        </div>
      </div>
      {open && items.map((item, i) => (
        <div key={i} className={`meal-item${i < items.length - 1 ? " meal-item--bordered" : ""}`}>
          <div>
            <span className="meal-item-name">{item.name}</span>
            <span className="meal-item-qty">
              {item.qty}{item.unit === "piece" ? " pc" : item.unit === "scoop" ? " scoop" : item.unit}
            </span>
          </div>
          <div className="meal-item-right">
            <span className="meal-macros">
              <span className="meal-protein">{Math.round(item.protein)}p</span>
              {" · "}
              <span className="meal-carbs">{Math.round(item.carbs)}c</span>
              {" · "}
              <span className="meal-fat">{Math.round(item.fat)}f</span>
            </span>
            <span className="meal-item-cal">{Math.round(item.cal)}</span>
            <button onClick={() => onRemove(i)} className="meal-remove-btn">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}
