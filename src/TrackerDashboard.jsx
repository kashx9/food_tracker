import { useState, useMemo } from "react";

// -------------------------------------------------------------------
// FOOD DATABASE — per 100g or per unit (unit: true means per 1 piece)
// -------------------------------------------------------------------
const FOOD_DB = {
  // name: { cal, protein, carbs, fat, unit (g or piece) }
  "Banana":           { cal: 89,  protein: 1.1, carbs: 23,  fat: 0.3, unit: "piece", gramsPerUnit: 120 },
  "Apple":            { cal: 52,  protein: 0.3, carbs: 14,  fat: 0.2, unit: "piece", gramsPerUnit: 150 },
  "Whole Egg":        { cal: 155, protein: 13,  carbs: 1.1, fat: 11,  unit: "piece", gramsPerUnit: 50  },
  "Paneer":           { cal: 265, protein: 18,  carbs: 1.2, fat: 20,  unit: "g",     gramsPerUnit: 1   },
  "Chicken Breast":   { cal: 165, protein: 31,  carbs: 0,   fat: 3.6, unit: "g",     gramsPerUnit: 1   },
  "Brown Rice":       { cal: 216, protein: 5,   carbs: 45,  fat: 1.8, unit: "g",     gramsPerUnit: 1   },
  "White Rice":       { cal: 206, protein: 4.3, carbs: 45,  fat: 0.4, unit: "g",     gramsPerUnit: 1   },
  "Roti":             { cal: 104, protein: 3.1, carbs: 18,  fat: 2.7, unit: "piece", gramsPerUnit: 40  },
  "Dal":              { cal: 116, protein: 9,   carbs: 20,  fat: 0.4, unit: "g",     gramsPerUnit: 1   },
  "Oats":             { cal: 389, protein: 17,  carbs: 66,  fat: 7,   unit: "g",     gramsPerUnit: 1   },
  "Whey Protein":     { cal: 120, protein: 24,  carbs: 3,   fat: 1.5, unit: "scoop", gramsPerUnit: 30  },
  "Milk (full fat)":  { cal: 61,  protein: 3.2, carbs: 4.8, fat: 3.3, unit: "ml",    gramsPerUnit: 1   },
  "Peanut Butter":    { cal: 588, protein: 25,  carbs: 20,  fat: 50,  unit: "g",     gramsPerUnit: 1   },
  "Curd":             { cal: 98,  protein: 3.5, carbs: 3.4, fat: 4.3, unit: "g",     gramsPerUnit: 1   },
  "Maggi (1 packet)": { cal: 340, protein: 7,   carbs: 47,  fat: 14,  unit: "piece", gramsPerUnit: 70  },
  "Almonds":          { cal: 579, protein: 21,  carbs: 22,  fat: 50,  unit: "g",     gramsPerUnit: 1   },
  "Chicken Curry":    { cal: 150, protein: 12,  carbs: 5,   fat: 8,   unit: "g",     gramsPerUnit: 1   },
  "Bread (white)":    { cal: 265, protein: 9,   carbs: 49,  fat: 3.2, unit: "piece", gramsPerUnit: 30  },
  "Greek Yogurt":     { cal: 59,  protein: 10,  carbs: 3.6, fat: 0.4, unit: "g",     gramsPerUnit: 1   },
  "Protein Bar":      { cal: 200, protein: 20,  carbs: 22,  fat: 6,   unit: "piece", gramsPerUnit: 60  },
};

const MEAL_SECTIONS = ["Breakfast", "Lunch", "Dinner", "Snacks", "Shakes"];

const ACCENT = "#e8ff47";
const C = {
  bg: "#0d0d0d",
  surface: "#161616",
  card: "#1a1a1a",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.14)",
  text: "#f0ede6",
  muted: "#6a6a62",
  dim: "#3a3a32",
  accent: ACCENT,
  accentDim: "rgba(232,255,71,0.12)",
  accentBorder: "rgba(232,255,71,0.25)",
  protein: "#4ade80",
  carbs: "#60a5fa",
  fat: "#f97316",
  red: "#ff4f4f",
};

// -------------------------------------------------------------------
// DONUT CHART
// -------------------------------------------------------------------
function DonutChart({ consumed, target }) {
  const pct = Math.min(consumed / target, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const remaining = target - consumed;
  const over = consumed > target;

  return (
    <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto" }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        {/* track */}
        <circle cx="70" cy="70" r={r} fill="none" stroke={C.dim} strokeWidth="10" />
        {/* fill */}
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke={over ? C.red : C.accent}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
      {/* center text */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 0,
      }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "26px", color: over ? C.red : C.text, lineHeight: 1 }}>
          {Math.round(consumed)}
        </span>
        <span style={{ fontSize: "10px", color: C.muted, letterSpacing: "0.5px" }}>
          / {target} cal
        </span>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// MACRO BAR
// -------------------------------------------------------------------
function MacroBar({ label, consumed, target, color }) {
  const pct = Math.min((consumed / target) * 100, 100);
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "12px", color: C.muted, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "12px", fontFamily: "'DM Mono', monospace", color: C.text }}>
          {Math.round(consumed)}g <span style={{ color: C.muted }}>/ {target}g</span>
        </span>
      </div>
      <div style={{ height: "5px", background: C.dim, borderRadius: "99px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: color, borderRadius: "99px",
          transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// ADD FOOD MODAL
// -------------------------------------------------------------------
function AddFoodModal({ onAdd, onClose }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(100);

  const filtered = Object.keys(FOOD_DB).filter(f =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  const food = selected ? FOOD_DB[selected] : null;
  const multiplier = food ? (qty * food.gramsPerUnit) / 100 : 0;

  const preview = food ? {
    cal:     Math.round(food.cal     * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs:   Math.round(food.carbs   * multiplier * 10) / 10,
    fat:     Math.round(food.fat     * multiplier * 10) / 10,
  } : null;

  function handleAdd() {
    if (!selected || qty <= 0) return;
    onAdd({
      name: selected,
      qty,
      unit: food.unit,
      ...preview,
    });
    onClose();
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}
      onClick={onClose}
    >
      <div style={{
        background: C.card, border: `0.5px solid ${C.border}`,
        borderRadius: "14px", padding: "1.4rem",
        width: "100%", maxWidth: "380px",
        maxHeight: "80vh", display: "flex", flexDirection: "column",
        gap: "12px",
      }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", letterSpacing: "1px", color: C.text }}>
            Add Food
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>

        {/* search */}
        <input
          autoFocus
          placeholder="Search food..."
          value={search}
          onChange={e => { setSearch(e.target.value); setSelected(null); }}
          style={inputStyle}
        />

        {/* list */}
        {!selected && (
          <div style={{ overflowY: "auto", maxHeight: "200px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {filtered.map(f => (
              <div key={f}
                onClick={() => { setSelected(f); setQty(FOOD_DB[f].unit === "g" || FOOD_DB[f].unit === "ml" ? 100 : 1); }}
                style={{
                  padding: "8px 12px", borderRadius: "8px", cursor: "pointer",
                  background: C.surface, border: `0.5px solid ${C.border}`,
                  fontSize: "13px", color: C.text,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <span>{f}</span>
                <span style={{ fontSize: "11px", color: C.muted, fontFamily: "'DM Mono', monospace" }}>
                  {FOOD_DB[f].cal} cal/100{FOOD_DB[f].unit === "piece" ? "pc" : FOOD_DB[f].unit}
                </span>
              </div>
            ))}
            {filtered.length === 0 && (
              <p style={{ fontSize: "13px", color: C.muted, textAlign: "center", padding: "1rem" }}>No food found</p>
            )}
          </div>
        )}

        {/* selected food qty */}
        {selected && food && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{
              padding: "8px 12px", borderRadius: "8px",
              background: C.accentDim, border: `0.5px solid ${C.accentBorder}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: "13px", color: C.text, fontWeight: 500 }}>{selected}</span>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "12px" }}>change</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontSize: "12px", color: C.muted, whiteSpace: "nowrap" }}>
                Quantity ({food.unit === "piece" ? "pcs" : food.unit === "scoop" ? "scoops" : food.unit})
              </label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={e => setQty(Number(e.target.value))}
                style={{ ...inputStyle, flex: 1, textAlign: "center" }}
              />
            </div>

            {preview && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px" }}>
                {[
                  { label: "Cal", val: preview.cal, color: C.accent },
                  { label: "Prot", val: `${preview.protein}g`, color: C.protein },
                  { label: "Carb", val: `${preview.carbs}g`, color: C.carbs },
                  { label: "Fat", val: `${preview.fat}g`, color: C.fat },
                ].map(m => (
                  <div key={m.label} style={{
                    background: C.surface, border: `0.5px solid ${C.border}`,
                    borderRadius: "8px", padding: "8px 4px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: m.color, fontFamily: "'DM Mono', monospace" }}>{m.val}</div>
                    <div style={{ fontSize: "10px", color: C.muted, marginTop: "2px" }}>{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={handleAdd} style={addBtnStyle}>Add to Meal</button>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// MEAL SECTION
// -------------------------------------------------------------------
function MealSection({ title, items, onAddClick, onRemove }) {
  const totals = items.reduce((acc, i) => ({
    cal: acc.cal + i.cal,
    protein: acc.protein + i.protein,
    carbs: acc.carbs + i.carbs,
    fat: acc.fat + i.fat,
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div style={{
      background: C.card, border: `0.5px solid ${C.border}`,
      borderRadius: "12px", overflow: "hidden", marginBottom: "10px",
    }}>
      {/* header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 14px",
        borderBottom: items.length > 0 ? `0.5px solid ${C.border}` : "none",
      }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "1px", color: C.text }}>
          {title}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {items.length > 0 && (
            <span style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: C.muted }}>
              {Math.round(totals.cal)} cal
            </span>
          )}
          <button onClick={onAddClick} style={plusBtnStyle}>+ Add</button>
        </div>
      </div>

      {/* items */}
      {items.map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 14px",
          borderBottom: i < items.length - 1 ? `0.5px solid ${C.border}` : "none",
        }}>
          <div>
            <span style={{ fontSize: "13px", color: C.text }}>{item.name}</span>
            <span style={{ fontSize: "11px", color: C.muted, marginLeft: "6px" }}>
              {item.qty}{item.unit === "piece" ? " pc" : item.unit === "scoop" ? " scoop" : item.unit}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: C.muted }}>
              <span style={{ color: C.protein }}>{Math.round(item.protein)}p</span>
              {" · "}
              <span style={{ color: C.carbs }}>{Math.round(item.carbs)}c</span>
              {" · "}
              <span style={{ color: C.fat }}>{Math.round(item.fat)}f</span>
            </span>
            <span style={{ fontSize: "12px", fontFamily: "'DM Mono', monospace", color: C.text }}>
              {Math.round(item.cal)}
            </span>
            <button onClick={() => onRemove(i)} style={{
              background: "none", border: "none", color: C.dim,
              cursor: "pointer", fontSize: "14px", lineHeight: 1,
              padding: "0 2px",
            }}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------------------
// MAIN PAGE
// -------------------------------------------------------------------
export default function TrackerDashboard({ userName = "Ayush", targetCal = 2661, targetProtein = 200, targetCarbs = 299, targetFat = 74 }) {
  const [meals, setMeals] = useState({
    Breakfast: [], Lunch: [], Dinner: [], Snacks: [], Shakes: [],
  });
  const [modal, setModal] = useState(null); // which meal section is adding

  function handleAdd(section, item) {
    setMeals(prev => ({
      ...prev,
      [section]: [...prev[section], item],
    }));
  }

  function handleRemove(section, index) {
    setMeals(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  }

  const totals = useMemo(() => {
    const all = Object.values(meals).flat();
    return all.reduce((acc, i) => ({
      cal:     acc.cal     + i.cal,
      protein: acc.protein + i.protein,
      carbs:   acc.carbs   + i.carbs,
      fat:     acc.fat     + i.fat,
    }), { cal: 0, protein: 0, carbs: 0, fat: 0 });
  }, [meals]);

  const remaining = targetCal - totals.cal;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>
      {/* NAV */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 1.5rem", borderBottom: `0.5px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", letterSpacing: "2px", color: C.accent }}>
          INDI.FIT
        </span>
        <span style={{ fontSize: "13px", color: C.muted }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
        </span>
      </nav>

      {/* LAYOUT */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: "16px",
        padding: "16px",
        maxWidth: "1100px",
        margin: "0 auto",
        alignItems: "start",
      }}>

        {/* LEFT — MEAL SECTIONS */}
        <div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", letterSpacing: "1.5px", color: C.text, marginBottom: "14px" }}>
            Today's Meals
          </h2>
          {MEAL_SECTIONS.map(section => (
            <MealSection
              key={section}
              title={section}
              items={meals[section]}
              onAddClick={() => setModal(section)}
              onRemove={(i) => handleRemove(section, i)}
            />
          ))}
        </div>

        {/* RIGHT — DASHBOARD */}
        <div style={{ position: "sticky", top: "16px" }}>
          {/* greeting */}
          <div style={{ marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", color: C.muted, textTransform: "uppercase", letterSpacing: "1px" }}>Hi,</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", letterSpacing: "1px", color: C.text, lineHeight: 1 }}>
              {userName}
            </p>
          </div>

          {/* calorie card */}
          <div style={{
            background: C.card, border: `0.5px solid ${C.border}`,
            borderRadius: "14px", padding: "1.2rem",
            marginBottom: "12px",
          }}>
            <DonutChart consumed={totals.cal} target={targetCal} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "16px" }}>
              <div style={{ textAlign: "center", padding: "10px", background: C.surface, borderRadius: "10px" }}>
                <div style={{ fontSize: "16px", fontWeight: 600, color: C.accent, fontFamily: "'DM Mono', monospace" }}>
                  {Math.round(totals.cal)}
                </div>
                <div style={{ fontSize: "10px", color: C.muted, marginTop: "2px" }}>Consumed</div>
              </div>
              <div style={{ textAlign: "center", padding: "10px", background: C.surface, borderRadius: "10px" }}>
                <div style={{ fontSize: "16px", fontWeight: 600, color: remaining < 0 ? C.red : C.text, fontFamily: "'DM Mono', monospace" }}>
                  {Math.abs(Math.round(remaining))}
                </div>
                <div style={{ fontSize: "10px", color: C.muted, marginTop: "2px" }}>{remaining < 0 ? "Over" : "Remaining"}</div>
              </div>
            </div>
          </div>

          {/* macros card */}
          <div style={{
            background: C.card, border: `0.5px solid ${C.border}`,
            borderRadius: "14px", padding: "1.2rem",
          }}>
            <p style={{ fontSize: "11px", color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>
              Macros
            </p>
            <MacroBar label="Protein" consumed={totals.protein} target={targetProtein} color={C.protein} />
            <MacroBar label="Carbs"   consumed={totals.carbs}   target={targetCarbs}   color={C.carbs}   />
            <MacroBar label="Fat"     consumed={totals.fat}     target={targetFat}     color={C.fat}     />
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <AddFoodModal
          onAdd={(item) => handleAdd(modal, item)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// SHARED MICRO STYLES
// -------------------------------------------------------------------
const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "0.5px solid rgba(255,255,255,0.12)",
  color: "#f0ede6",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  padding: "0 12px",
  height: "40px",
  borderRadius: "8px",
  outline: "none",
};

const plusBtnStyle = {
  background: "rgba(232,255,71,0.1)",
  border: "0.5px solid rgba(232,255,71,0.25)",
  color: "#e8ff47",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "12px",
  fontWeight: 600,
  padding: "4px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const addBtnStyle = {
  width: "100%",
  background: "#e8ff47",
  color: "#0d0d0d",
  border: "none",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "14px",
  fontWeight: 600,
  height: "42px",
  borderRadius: "8px",
  cursor: "pointer",
};