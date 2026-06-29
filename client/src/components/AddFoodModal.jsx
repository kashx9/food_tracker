import { useState } from "react";
import "./AddFoodModal.css";

export function AddFoodModal({ onAdd, onClose, foods, favMeals = [], onAddMeal }) {
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [qty,      setQty]      = useState(100);

  const filtered   = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const food       = selected ? foods.find(f => f.name === selected) : null;
  const multiplier = food ? (qty * food.gramsPerUnit) / 100 : 0;

  const preview = food ? {
    cal:     Math.round(food.calories * multiplier),
    protein: Math.round(food.protein  * multiplier * 10) / 10,
    carbs:   Math.round(food.carbs    * multiplier * 10) / 10,
    fat:     Math.round(food.fat      * multiplier * 10) / 10,
  } : null;

  function handleAdd() {
    if (!selected || qty <= 0) return;
    onAdd({ foodId: food._id, name: selected, qty, unit: food.unit, ...preview });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <span className="modal-title">Add Food</span>
          <button onClick={onClose} className="modal-close-btn">✕</button>
        </div>

        {favMeals.length > 0 && (
          <div className="fav-meals-section">
            <div className="fav-meals-label">Fav Meals</div>
            <div className="fav-meals-chips">
              {favMeals.map(meal => (
                <button
                  key={meal._id}
                  className="fav-meal-chip"
                  onClick={() => { if (onAddMeal) onAddMeal(meal.items); onClose(); }}
                >
                  {meal.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <input autoFocus placeholder="Search food..." value={search}
          onChange={e => { setSearch(e.target.value); setSelected(null); }}
          className="modal-input" />

        {!selected && (
          <div className="food-list">
            {filtered.map(f => (
              <div key={f._id}
                onClick={() => { setSelected(f.name); setQty(f.unit === "g" || f.unit === "ml" ? 100 : 1); }}
                className="food-item">
                <span>{f.name}</span>
                <span className="food-item-cal">
                  {f.calories} cal/100{f.unit === "piece" ? "pc" : f.unit}
                </span>
              </div>
            ))}
            {filtered.length === 0 && <p className="food-empty">No food found</p>}
          </div>
        )}

        {selected && food && (
          <div className="selected-food-section">
            <div className="selected-food-header">
              <span className="selected-food-name">{selected}</span>
              <button onClick={() => setSelected(null)} className="selected-food-change">change</button>
            </div>

            <div className="qty-row">
              <label className="qty-label">
                Qty ({food.unit === "piece" ? "pcs" : food.unit === "scoop" ? "scoops" : food.unit})
              </label>
              <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))}
                className="modal-input qty-input" />
            </div>

            {preview && (
              <div className="preview-grid">
                {[
                  { label: "Cal",  val: preview.cal,            color: "#e8ff47" },
                  { label: "Prot", val: `${preview.protein}g`,  color: "#4ade80" },
                  { label: "Carb", val: `${preview.carbs}g`,    color: "#60a5fa" },
                  { label: "Fat",  val: `${preview.fat}g`,      color: "#f97316" },
                ].map(m => (
                  <div key={m.label} className="preview-item">
                    <div className="preview-val" style={{ color: m.color }}>{m.val}</div>
                    <div className="preview-label">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleAdd} className="modal-add-btn">Add to Meal</button>
          </div>
        )}
      </div>
    </div>
  );
}
