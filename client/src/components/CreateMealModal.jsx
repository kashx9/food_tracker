import { useState } from "react";
import "./CreateMealModal.css";

export function CreateMealModal({ onClose, onSave, foods }) {
  const [mealName, setMealName] = useState("");
  const [items,    setItems]    = useState([]);
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [qty,      setQty]      = useState(100);
  const [saving,   setSaving]   = useState(false);

  const filtered   = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const food       = selected ? foods.find(f => f.name === selected) : null;
  const multiplier = food ? (qty * food.gramsPerUnit) / 100 : 0;

  const preview = food ? {
    cal:     Math.round(food.calories * multiplier),
    protein: Math.round(food.protein  * multiplier * 10) / 10,
    carbs:   Math.round(food.carbs    * multiplier * 10) / 10,
    fat:     Math.round(food.fat      * multiplier * 10) / 10,
  } : null;

  function addItem() {
    if (!selected || qty <= 0 || !food || !preview) return;
    setItems(prev => [...prev, { foodId: food._id, name: selected, qty, unit: food.unit, ...preview }]);
    setSelected(null);
    setSearch("");
    setQty(100);
  }

  async function handleSave() {
    if (!mealName.trim() || items.length === 0) return;
    setSaving(true);
    await onSave({ name: mealName.trim(), items });
    setSaving(false);
    onClose();
  }

  const totalCal = Math.round(items.reduce((a, i) => a + i.cal, 0));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-modal-panel" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <span className="modal-title">Create Fav Meal</span>
          <button onClick={onClose} className="modal-close-btn">✕</button>
        </div>

        <input
          placeholder="Meal name (e.g. My Oats)"
          value={mealName}
          onChange={e => setMealName(e.target.value)}
          className="modal-input"
        />

        {items.length > 0 && (
          <div className="create-items-list">
            {items.map((item, i) => (
              <div key={i} className="create-item-row">
                <span className="create-item-name">{item.name}</span>
                <span className="create-item-qty">{item.qty}{item.unit === "piece" ? "pc" : item.unit}</span>
                <span className="create-item-macros">
                  <span style={{ color: "#4ade80" }}>{item.protein}p</span>
                  {" · "}
                  <span style={{ color: "#60a5fa" }}>{item.carbs}c</span>
                  {" · "}
                  <span style={{ color: "#f97316" }}>{item.fat}f</span>
                </span>
                <span className="create-item-cal">{item.cal}</span>
                <button onClick={() => setItems(prev => prev.filter((_, j) => j !== i))} className="meal-remove-btn">✕</button>
              </div>
            ))}
            <div className="create-items-total">{totalCal} kcal total</div>
          </div>
        )}

        <div className="create-picker">
          {!selected ? (
            <>
              <input
                placeholder="Search and add food..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="modal-input"
              />
              {search && (
                <div className="food-list">
                  {filtered.map(f => (
                    <div key={f._id}
                      onClick={() => { setSelected(f.name); setQty(f.unit === "g" || f.unit === "ml" ? 100 : 1); setSearch(""); }}
                      className="food-item">
                      <span>{f.name}</span>
                      <span className="food-item-cal">{f.calories} cal/100{f.unit === "piece" ? "pc" : f.unit}</span>
                    </div>
                  ))}
                  {filtered.length === 0 && <p className="food-empty">No food found</p>}
                </div>
              )}
            </>
          ) : food && (
            <div className="create-selected-area">
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
              <button onClick={addItem} className="create-add-food-btn">+ Add Food</button>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={!mealName.trim() || items.length === 0 || saving}
          className="modal-add-btn"
        >
          {saving ? "Saving..." : "Save Meal"}
        </button>
      </div>
    </div>
  );
}
