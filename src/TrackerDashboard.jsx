import { useState, useMemo, useEffect } from "react";

const MEAL_SECTIONS = ["Breakfast", "Lunch", "Dinner", "Snacks", "Shakes"];

const C = {
  bg: "#0d0d0d", surface: "#161616", card: "#1a1a1a",
  border: "rgba(255,255,255,0.07)", text: "#f0ede6",
  muted: "#6a6a62", dim: "#3a3a32",
  accent: "#e8ff47",
  accentDim: "rgba(232,255,71,0.12)", accentBorder: "rgba(232,255,71,0.25)",
  protein: "#4ade80", carbs: "#60a5fa", fat: "#f97316", red: "#ff4f4f",
};

// ── Donut Chart ──────────────────────────────
function DonutChart({ consumed, target }) {
  const pct = Math.min(consumed / target, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const over = consumed > target;

  return (
    <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto" }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke={C.dim} strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none"
          stroke={over ? C.red : C.accent} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "26px", color: over ? C.red : C.text, lineHeight: 1 }}>
          {Math.round(consumed)}
        </span>
        <span style={{ fontSize: "10px", color: C.muted, letterSpacing: "0.5px" }}>/ {target} cal</span>
      </div>
    </div>
  );
}

// ── Macro Bar ────────────────────────────────
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
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "99px", transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

// ── Add Food Modal ───────────────────────────
function AddFoodModal({ onAdd, onClose, foods }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(100);

  const filtered = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const food = selected ? foods.find(f => f.name === selected) : null;

  const multiplier = food ? (qty * food.gramsPerUnit) / 100 : 0;

  const preview = food ? {
    cal: Math.round(food.calories * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs: Math.round(food.carbs * multiplier * 10) / 10,
    fat: Math.round(food.fat * multiplier * 10) / 10,
  } : null;

  function handleAdd() {
    if (!selected || qty <= 0) return;
    onAdd({
      foodId: food._id,  // NEW: Add this for backend
      name: selected,
      qty,
      unit: food.unit,
      ...preview
    });
    onClose();
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={onClose}>
      <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: "14px", padding: "1.4rem", width: "100%", maxWidth: "380px", maxHeight: "80vh", display: "flex", flexDirection: "column", gap: "12px" }}
        onClick={e => e.stopPropagation()}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", letterSpacing: "1px", color: C.text }}>Add Food</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>

        <input autoFocus placeholder="Search food..." value={search}
          onChange={e => { setSearch(e.target.value); setSelected(null); }}
          style={inputStyle} />

        {!selected && (
          <div style={{ overflowY: "auto", maxHeight: "200px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {filtered.map(f => (
              <div key={f._id}
                onClick={() => {
                  setSelected(f.name);  // Changed from f to f.name
                  setQty(f.unit === "g" || f.unit === "ml" ? 100 : 1);
                }}
                style={{ padding: "8px 12px", borderRadius: "8px", cursor: "pointer", background: C.surface, border: `0.5px solid ${C.border}`, fontSize: "13px", color: C.text, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{f.name}</span>
                <span style={{ fontSize: "11px", color: C.muted, fontFamily: "'DM Mono', monospace" }}>
                  {f.calories} cal/100{f.unit === "piece" ? "pc" : f.unit}
                </span>
              </div>
            ))}
            {filtered.length === 0 && <p style={{ fontSize: "13px", color: C.muted, textAlign: "center", padding: "1rem" }}>No food found</p>}
          </div>
        )}

        {selected && food && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ padding: "8px 12px", borderRadius: "8px", background: C.accentDim, border: `0.5px solid ${C.accentBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: C.text, fontWeight: 500 }}>{selected}</span>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "12px" }}>change</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontSize: "12px", color: C.muted, whiteSpace: "nowrap" }}>
                Qty ({food.unit === "piece" ? "pcs" : food.unit === "scoop" ? "scoops" : food.unit})
              </label>
              <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))}
                style={{ ...inputStyle, flex: 1, textAlign: "center" }} />
            </div>

            {preview && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px" }}>
                {[
                  { label: "Cal", val: preview.cal, color: C.accent },
                  { label: "Prot", val: `${preview.protein}g`, color: C.protein },
                  { label: "Carb", val: `${preview.carbs}g`, color: C.carbs },
                  { label: "Fat", val: `${preview.fat}g`, color: C.fat },
                ].map(m => (
                  <div key={m.label} style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: "8px", padding: "8px 4px", textAlign: "center" }}>
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

// ── Meal Section ─────────────────────────────
function MealSection({ title, items, onAddClick, onRemove }) {
  const totals = items.reduce((acc, i) => ({
    cal: acc.cal + i.cal, protein: acc.protein + i.protein,
    carbs: acc.carbs + i.carbs, fat: acc.fat + i.fat,
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", marginBottom: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: items.length > 0 ? `0.5px solid ${C.border}` : "none" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "1px", color: C.text }}>{title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {items.length > 0 && (
            <span style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: C.muted }}>{Math.round(totals.cal)} cal</span>
          )}
          <button onClick={onAddClick} style={plusBtnStyle}>+ Add</button>
        </div>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: i < items.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
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
            <span style={{ fontSize: "12px", fontFamily: "'DM Mono', monospace", color: C.text }}>{Math.round(item.cal)}</span>
            <button onClick={() => onRemove(i)} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: "14px", lineHeight: 1, padding: "0 2px" }}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Export ──────────────────────────────
export default function TrackerDashboard({
  userName,
  targetCal,
  targetProtein,
  targetCarbs,
  targetFat,
  onBack = null,
  onLogout = null,
}) {
  const [foods, setFoods] = useState([]); // NEW: Store fetched foods
  const [foodsLoading, setFoodsLoading] = useState(true); // NEW: Loading state
  const [foodsError, setFoodsError] = useState(null); // NEW: Error state
  const [mealsError, setMealsError] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const [mealData, setMealData] = useState(null); // Store DB meal data with _id for deletion
  const [mealsLoading, setMealsLoading] = useState(false);

  const [meals, setMeals] = useState({ Breakfast: [], Lunch: [], Dinner: [], Snacks: [], Shakes: [] });
  const [modal, setModal] = useState(null);

  function handleAuthFailure(message) {
    const errorMessage = message || "Session expired. Please log in again.";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setFoodsError(errorMessage);
    setMealsError(errorMessage);
    setSessionExpired(true);
    if (onLogout) {
      onLogout();
    }
  }

  // NEW: Fetch foods when component mounts
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setFoodsLoading(true);
        const response = await fetch("http://localhost:5000/api/v1/foods");
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            return handleAuthFailure("Session expired. Please log in again.");
          }
          throw new Error(data.message || "Failed to fetch foods");
        }

        setFoods(data.data); // Backend returns { success: true, data: [foods] }
      } catch (error) {
        console.error("Error fetching foods:", error);
        setFoodsError(error.message);
      } finally {
        setFoodsLoading(false);
      }
    };

    fetchFoods();
  }, []); // Empty dependency array = run once on mount

  // NEW: Fetch meals for today when component mounts
  useEffect(() => {
    const fetchTodaysMeals = async () => {
      try {
        setMealsLoading(true);
        const today = new Date().toISOString().split('T')[0]; // Get today's date as YYYY-MM-DD
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/v1/meals/${today}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            return handleAuthFailure("Session expired. Please log in again.");
          }
          throw new Error(data.message || "Failed to fetch meals");
        }

        if (data.success) {
          // Convert DB format to local state format
          const meals = {
            Breakfast: data.data.meals?.Breakfast || [],
            Lunch: data.data.meals?.Lunch || [],
            Dinner: data.data.meals?.Dinner || [],
            Snacks: data.data.meals?.Snacks || [],
            Shakes: data.data.meals?.Shakes || [],
          };
          setMeals(meals);
          setMealData(data.data); // Store the full meal doc for later deletion
        } else {
          throw new Error(data.message || "Failed to fetch meals");
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
        setMealsError(error.message);
      } finally {
        setMealsLoading(false);
      }
    };

    fetchTodaysMeals();
  }, []);

  async function handleAdd(section, item) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/v1/meals", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: today,
          mealType: section, // "Breakfast", "Lunch", etc
          item: {
            foodId: item.foodId,
            name: item.name,
            qty: item.qty,
            unit: item.unit,
            cal: item.cal,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return handleAuthFailure("Session expired. Please log in again.");
        }
        setMealsError(data.message || "Failed to add meal.");
        console.error("Error adding meal:", data.message);
        return;
      }

      // Use server response so newly added items include DB-generated _id values.
      const updatedMeals = {
        Breakfast: data.data.meals?.Breakfast || [],
        Lunch: data.data.meals?.Lunch || [],
        Dinner: data.data.meals?.Dinner || [],
        Snacks: data.data.meals?.Snacks || [],
        Shakes: data.data.meals?.Shakes || [],
      };

      setMeals(updatedMeals);
      setMealData(data.data);

    } catch (error) {
      console.error("Error adding meal:", error);
      setMealsError(error.message);
    }
  }

  async function handleRemove(section, index) {
    try {
      const token = localStorage.getItem("token");
      const item = meals[section][index];
      
      // Get the item's _id from the DB
      const itemId = item._id;
      if (!mealData?._id || !itemId) {
        console.error("Missing IDs for deletion");
        return;
      }
      
      const response = await fetch(
        `http://localhost:5000/api/v1/meals/${mealData._id}/${section}/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return handleAuthFailure("Session expired. Please log in again.");
        }
        setMealsError(data.message || "Failed to delete meal.");
        console.error("Error deleting meal:", data.message);
        return;
      }
      
      // Update local state
      setMeals(prev => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index)
      }));
      
      // Update mealData with the response
      setMealData(data.data);
      
    } catch (error) {
      console.error("Error deleting meal:", error);
      setMealsError(error.message);
    }
  }

const totals = useMemo(() => {
  return Object.values(meals).flat().reduce(
    (acc, i) => ({ cal: acc.cal + i.cal, protein: acc.protein + i.protein, carbs: acc.carbs + i.carbs, fat: acc.fat + i.fat }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}, [meals]);

const remaining = targetCal - totals.cal;

return (
  <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", borderBottom: `0.5px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "13px", padding: 0 }}>
            ← Back
          </button>
        )}
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", letterSpacing: "2px", color: C.accent }}>INDI.FIT</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "13px", color: C.muted }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
        </span>
        {onLogout && (
          <button onClick={onLogout} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "13px", padding: 0 }}>
            Logout
          </button>
        )}
      </div>
    </nav>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px", padding: "16px", maxWidth: "1100px", margin: "0 auto", alignItems: "start" }}>
      <div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", letterSpacing: "1.5px", color: C.text, marginBottom: "14px" }}>
          Today's Meals
        </h2>
        {foodsLoading && (
          <div style={{ marginBottom: "14px", padding: "12px", borderRadius: "12px", background: C.surface, color: C.text, border: `0.5px solid ${C.border}` }}>
            Loading foods…
          </div>
        )}
        {mealsLoading && (
          <div style={{ marginBottom: "14px", padding: "12px", borderRadius: "12px", background: C.surface, color: C.text, border: `0.5px solid ${C.border}` }}>
            Loading meals…
          </div>
        )}
        {(foodsError || mealsError) && (
          <div style={{ marginBottom: "14px", padding: "12px", borderRadius: "12px", background: "rgba(255, 79, 79, 0.08)", color: C.red, border: `0.5px solid rgba(255, 79, 79, 0.25)`, fontSize: "13px" }}>
            {foodsError || mealsError}
          </div>
        )}
        {!mealsLoading && !foodsError && !mealsError && Object.values(meals).flat().length === 0 && (
          <div style={{ marginBottom: "14px", padding: "14px", borderRadius: "12px", background: C.surface, color: C.muted, border: `0.5px solid ${C.border}` }}>
            No meals logged yet. Add a meal to get going.
          </div>
        )}
        {MEAL_SECTIONS.map(section => (
          <MealSection key={section} title={section}
            items={meals[section]}
            onAddClick={() => setModal(section)}
            onRemove={(i) => handleRemove(section, i)}
          />
        ))}
      </div>

      <div style={{ position: "sticky", top: "16px" }}>
        <div style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "12px", color: C.muted, textTransform: "uppercase", letterSpacing: "1px" }}>Hi,</p>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", letterSpacing: "1px", color: C.text, lineHeight: 1 }}>{userName}</p>
        </div>

        <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: "14px", padding: "1.2rem", marginBottom: "12px" }}>
          <DonutChart consumed={totals.cal} target={targetCal} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "16px" }}>
            <div style={{ textAlign: "center", padding: "10px", background: C.surface, borderRadius: "10px" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: C.accent, fontFamily: "'DM Mono', monospace" }}>{Math.round(totals.cal)}</div>
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

        <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: "14px", padding: "1.2rem" }}>
          <p style={{ fontSize: "11px", color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>Macros</p>
          <MacroBar label="Protein" consumed={totals.protein} target={targetProtein} color={C.protein} />
          <MacroBar label="Carbs" consumed={totals.carbs} target={targetCarbs} color={C.carbs} />
          <MacroBar label="Fat" consumed={totals.fat} target={targetFat} color={C.fat} />
        </div>
      </div>
    </div>

    {modal && (
      <AddFoodModal foods={foods} onAdd={(item) => handleAdd(modal, item)} onClose={() => setModal(null)} />
    )}
  </div>
);
}

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.05)",
  border: "0.5px solid rgba(255,255,255,0.12)", color: "#f0ede6",
  fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
  padding: "0 12px", height: "40px", borderRadius: "8px", outline: "none",
};

const plusBtnStyle = {
  background: "rgba(232,255,71,0.1)", border: "0.5px solid rgba(232,255,71,0.25)",
  color: "#e8ff47", fontFamily: "'DM Sans', sans-serif",
  fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px", cursor: "pointer",
};

const addBtnStyle = {
  width: "100%", background: "#e8ff47", color: "#0d0d0d", border: "none",
  fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600,
  height: "42px", borderRadius: "8px", cursor: "pointer",
};