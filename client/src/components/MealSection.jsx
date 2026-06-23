import "./MealSection.css";

export function MealSection({ title, items, onAddClick, onRemove }) {
  const totals = items.reduce((acc, i) => ({
    cal:     acc.cal     + i.cal,
    protein: acc.protein + i.protein,
    carbs:   acc.carbs   + i.carbs,
    fat:     acc.fat     + i.fat,
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="meal-section">
      <div className={`meal-header${items.length > 0 ? " meal-header--bordered" : ""}`}>
        <span className="meal-title">{title}</span>
        <div className="meal-header-right">
          {items.length > 0 && (
            <span className="meal-cal-badge">{Math.round(totals.cal)} cal</span>
          )}
          <button onClick={onAddClick} className="meal-add-btn">+ Add</button>
        </div>
      </div>
      {items.map((item, i) => (
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
