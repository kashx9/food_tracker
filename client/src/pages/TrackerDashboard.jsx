import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { NavBar }             from "../components/NavBar";
import { DonutChart }         from "../components/DonutChart";
import { MacroBar }           from "../components/MacroBar";
import { MealSection }        from "../components/MealSection";
import { AddFoodModal }       from "../components/AddFoodModal";
import { CreateMealModal }    from "../components/CreateMealModal";
import { C, MEAL_SECTIONS }   from "../utils/constants";
import { fetchFoods, fetchMeals, addMeal, deleteMeal, fetchFavMeals, addFavMeal as apiAddFavMeal } from "../utils/api";
import "./TrackerDashboard.css";

function localDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export default function TrackerDashboard() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const userName      = userData?.userName;
  const targetCal     = userData?.targetCal ?? 0;
  const targetProtein = userData?.protein   ?? 0;
  const targetCarbs   = userData?.carbs     ?? 0;
  const targetFat     = userData?.fat       ?? 0;
  const [foods,        setFoods]        = useState([]);
  const [foodsLoading, setFoodsLoading] = useState(true);
  const [foodsError,   setFoodsError]   = useState(null);
  const [mealsError,   setMealsError]   = useState(null);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [mealData,     setMealData]     = useState(null);
  const [meals,        setMeals]        = useState({ Breakfast: [], Lunch: [], Dinner: [], Snacks: [], Shakes: [] });
  const [favMeals,     setFavMeals]     = useState([]);
  const [modal,        setModal]        = useState(null);
  const [showCreate,   setShowCreate]   = useState(false);

  function handleLogout() {
    logout();
    navigate("/auth?mode=login");
  }

  function handleAuthFailure(message) {
    setFoodsError(message || "Session expired. Please log in again.");
    setMealsError(message || "Session expired. Please log in again.");
    logout();
    navigate("/auth?mode=login");
  }

  function applyMealData(data) {
    setMeals({
      Breakfast: data.meals?.Breakfast || [],
      Lunch:     data.meals?.Lunch     || [],
      Dinner:    data.meals?.Dinner    || [],
      Snacks:    data.meals?.Snacks    || [],
      Shakes:    data.meals?.Shakes    || [],
    });
    setMealData(data);
  }

  async function reloadMeals() {
    const today = localDate();
    const res   = await fetchMeals(today);
    const data  = await res.json();
    if (res.ok && data.success) applyMealData(data.data);
  }

  useEffect(() => {
    async function loadFoods() {
      try {
        setFoodsLoading(true);
        const res  = await fetchFoods();
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) return handleAuthFailure();
          throw new Error(data.message || "Failed to fetch foods");
        }
        setFoods(data.data);
      } catch (err) {
        setFoodsError(err.message);
      } finally {
        setFoodsLoading(false);
      }
    }
    loadFoods();
  }, []);

  useEffect(() => {
    async function loadMeals() {
      try {
        setMealsLoading(true);
        const today = localDate();
        const res   = await fetchMeals(today);
        const data  = await res.json();
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) return handleAuthFailure();
          throw new Error(data.message || "Failed to fetch meals");
        }
        if (data.success) applyMealData(data.data);
      } catch (err) {
        setMealsError(err.message);
      } finally {
        setMealsLoading(false);
      }
    }
    loadMeals();
  }, []);

  useEffect(() => {
    if (!userData?.userId) return;
    async function loadFavMeals() {
      try {
        const res  = await fetchFavMeals(userData.userId);
        const data = await res.json();
        if (res.ok && data.success) setFavMeals(data.data);
      } catch {
        /* non-critical, ignore silently */
      }
    }
    loadFavMeals();
  }, [userData?.userId]);

  async function handleAdd(section, item) {
    try {
      const today = localDate();
      const res   = await addMeal(today, section, {
        foodId: item.foodId, name: item.name, qty: item.qty, unit: item.unit,
        cal: item.cal, protein: item.protein, carbs: item.carbs, fat: item.fat,
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return handleAuthFailure();
        setMealsError(data.message || "Failed to add meal.");
        return;
      }
      applyMealData(data.data);
    } catch (err) {
      setMealsError(err.message);
    }
  }

  async function handleAddMeal(section, items) {
    try {
      const today = localDate();
      for (const item of items) {
        await addMeal(today, section, {
          foodId: item.foodId, name: item.name, qty: item.qty, unit: item.unit,
          cal: item.cal, protein: item.protein, carbs: item.carbs, fat: item.fat,
        });
      }
      await reloadMeals();
    } catch (err) {
      setMealsError(err.message);
    }
  }

  async function handleSaveFavMeal({ name, items }) {
    if (!userData?.userId) return;
    try {
      const res  = await apiAddFavMeal(userData.userId, { name, items });
      const data = await res.json();
      if (res.ok && data.success) setFavMeals(data.data);
    } catch {
      /* non-critical, ignore silently */
    }
  }

  async function handleRemove(section, index) {
    try {
      const item   = meals[section][index];
      const itemId = item._id;
      if (!mealData?._id || !itemId) return;
      const res  = await deleteMeal(mealData._id, section, itemId);
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return handleAuthFailure();
        setMealsError(data.message || "Failed to delete meal.");
        return;
      }
      setMeals(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
      setMealData(data.data);
    } catch (err) {
      setMealsError(err.message);
    }
  }

  const totals = useMemo(() =>
    Object.values(meals).flat().reduce(
      (acc, i) => ({ cal: acc.cal + i.cal, protein: acc.protein + i.protein, carbs: acc.carbs + i.carbs, fat: acc.fat + i.fat }),
      { cal: 0, protein: 0, carbs: 0, fat: 0 }
    ), [meals]);

  const remaining = targetCal - totals.cal;
  const dateLabel = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div className="tracker-dashboard">

      <NavBar
        onLogout={handleLogout}
        middleSlot={<><button className="active">Tracker</button><button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/profile")}>Profile</button></>}
        rightSlot={<span className="date-label">{dateLabel}</span>}
      />

      <div className="tracker-grid">

        <div>
          <h2 className="tracker-meals-heading">Today's Meals</h2>

          {foodsLoading && (
            <div className="status-banner status-banner--loading">Loading foods…</div>
          )}
          {mealsLoading && (
            <div className="status-banner status-banner--loading">Loading meals…</div>
          )}
          {(foodsError || mealsError) && (
            <div className="status-banner status-banner--error">
              {foodsError || mealsError}
            </div>
          )}
          {!mealsLoading && !foodsError && !mealsError && Object.values(meals).flat().length === 0 && (
            <div className="status-banner status-banner--empty">
              No meals logged yet. Add a meal to get going.
            </div>
          )}

          {MEAL_SECTIONS.map(section => (
            <MealSection key={section} title={section}
              items={meals[section]}
              onAddClick={() => setModal(section)}
              onRemove={(i) => handleRemove(section, i)}
              onCreateClick={() => setShowCreate(true)}
            />
          ))}
        </div>

        <div className="tracker-sidebar">
          <div className="greeting">
            <p className="greeting-hi">Hi,</p>
            <p className="greeting-name">{userName}</p>
          </div>

          <div className="calorie-card">
            <DonutChart consumed={totals.cal} target={targetCal} />
            <div className="cal-grid">
              <div className="cal-box">
                <div className="cal-value cal-value--consumed">{Math.round(totals.cal)}</div>
                <div className="cal-label">Consumed</div>
              </div>
              <div className="cal-box">
                <div className="cal-value" style={{ color: remaining < 0 ? C.red : C.text }}>
                  {Math.abs(Math.round(remaining))}
                </div>
                <div className="cal-label">{remaining < 0 ? "Over" : "Remaining"}</div>
              </div>
            </div>
          </div>

          <div className="macro-card">
            <p className="macro-heading">Macros</p>
            <MacroBar label="Protein" consumed={totals.protein} target={targetProtein} color={C.protein} />
            <MacroBar label="Carbs"   consumed={totals.carbs}   target={targetCarbs}   color={C.carbs}   />
            <MacroBar label="Fat"     consumed={totals.fat}      target={targetFat}     color={C.fat}     />
          </div>
        </div>
      </div>

      {modal && (
        <AddFoodModal
          foods={foods}
          favMeals={favMeals}
          onAdd={(item) => handleAdd(modal, item)}
          onAddMeal={(items) => handleAddMeal(modal, items)}
          onClose={() => setModal(null)}
        />
      )}

      {showCreate && (
        <CreateMealModal
          foods={foods}
          onSave={handleSaveFavMeal}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
