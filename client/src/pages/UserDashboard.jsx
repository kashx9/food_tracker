import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { NavBar } from "../components/NavBar";
import { fetchMealHistory, fetchFavMeals, deleteFavMeal } from "../utils/api";

function localDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
import "./UserDashboard.css";

const SECTIONS = ["Breakfast", "Lunch", "Dinner", "Snacks", "Shakes"];

function DayCard({ entry }) {
  const [open, setOpen] = useState(false);

  const allItems = SECTIONS.flatMap(s => entry.meals?.[s] || []);
  const totalCal = Math.round(allItems.reduce((a, i) => a + i.cal, 0));
  const totalP = Math.round(allItems.reduce((a, i) => a + i.protein, 0));
  const totalC = Math.round(allItems.reduce((a, i) => a + i.carbs, 0));
  const totalF = Math.round(allItems.reduce((a, i) => a + i.fat, 0));

  const dateStr = new Date(entry.date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });

  return (
    <div className="day-card">
      <div className="day-card-header" onClick={() => setOpen(o => !o)}>
        <div className="day-card-left">
          <span className="day-collapse-arrow">{open ? "▾" : "▸"}</span>
          <span className="day-date">{dateStr}</span>
          <span className="day-macro-summary">
            <span className="day-p">{totalP}p</span>
            {" · "}
            <span className="day-c">{totalC}c</span>
            {" · "}
            <span className="day-f">{totalF}f</span>
          </span>
        </div>
        <span className="day-cal-badge">{totalCal} kcal</span>
      </div>

      {open && (
        <div className="day-card-body">
          {SECTIONS.map(sec => {
            const items = entry.meals?.[sec] || [];
            if (!items.length) return null;
            return (
              <div key={sec} className="day-section">
                <div className="day-section-title">{sec}</div>
                {items.map((item, i) => (
                  <div key={i} className="day-item">
                    <span className="day-item-name">{item.name}</span>
                    <span className="day-item-qty">
                      {item.qty}{item.unit === "piece" ? "pc" : item.unit}
                    </span>
                    <span className="day-item-macros">
                      <span className="day-p">{Math.round(item.protein)}p</span>
                      {" · "}
                      <span className="day-c">{Math.round(item.carbs)}c</span>
                      {" · "}
                      <span className="day-f">{Math.round(item.fat)}f</span>
                    </span>
                    <span className="day-item-cal">{Math.round(item.cal)}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FavMealCard({ meal, onDelete }) {
  const [open, setOpen] = useState(false);
  const totalCal = Math.round(meal.items.reduce((a, i) => a + i.cal, 0));

  return (
    <div className="day-card">
      <div className="day-card-header" onClick={() => setOpen(o => !o)}>
        <div className="day-card-left">
          <span className="day-collapse-arrow">{open ? "▾" : "▸"}</span>
          <span className="day-date">{meal.name}</span>
          <span className="day-macro-summary">{meal.items.length} item{meal.items.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="fav-card-right">
          <span className="day-cal-badge">{totalCal} kcal</span>
          <button
            className="fav-delete-btn"
            onClick={e => { e.stopPropagation(); onDelete(meal._id); }}
          >
            ✕
          </button>
        </div>
      </div>

      {open && (
        <div className="day-card-body">
          {meal.items.map((item, i) => (
            <div key={i} className="day-item">
              <span className="day-item-name">{item.name}</span>
              <span className="day-item-qty">
                {item.qty}{item.unit === "piece" ? "pc" : item.unit}
              </span>
              <span className="day-item-macros">
                <span className="day-p">{Math.round(item.protein)}p</span>
                {" · "}
                <span className="day-c">{Math.round(item.carbs)}c</span>
                {" · "}
                <span className="day-f">{Math.round(item.fat)}f</span>
              </span>
              <span className="day-item-cal">{Math.round(item.cal)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("history");
  const [history, setHistory] = useState([]);
  const [favMeals, setFavMeals] = useState([]);
  const [histLoading, setHistLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);

  const dateLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });

  function handleLogout() {
    logout();
    navigate("/auth?mode=login");
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchMealHistory(localDate());
        const data = await res.json();
        if (res.ok && data.success) setHistory(data.data);
      } catch {
        /* ignore */
      } finally {
        setHistLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!userData?.userId) return;
    async function load() {
      setFavLoading(true);
      try {
        const res = await fetchFavMeals(userData.userId);
        const data = await res.json();
        if (res.ok && data.success) setFavMeals(data.data);
      } catch {
        /* ignore */
      } finally {
        setFavLoading(false);
      }
    }
    load();
  }, [userData?.userId]);

  async function handleDeleteFav(favMealId) {
    if (!userData?.userId) return;
    try {
      const res = await deleteFavMeal(userData.userId, favMealId);
      const data = await res.json();
      if (res.ok && data.success) setFavMeals(data.data);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="dashboard-page">
      <NavBar
        onLogout={handleLogout}
        middleSlot={
          <>
            <button onClick={() => navigate("/tracker")}>Tracker</button>
            <button className="active">Dashboard</button>
            <button onClick={() => navigate("/profile")}>Profile</button>
          </>
        }
        rightSlot={<span className="date-label">{dateLabel}</span>}
      />

      <div className="dashboard-body">
        <nav className="profile-nav">
          <button
            className={`profile-nav-btn${tab === "history" ? " active" : ""}`}
            onClick={() => setTab("history")}
          >
            History
          </button>
          <button
            className={`profile-nav-btn${tab === "fav-meals" ? " active" : ""}`}
            onClick={() => setTab("fav-meals")}
          >
            Fav Meals
          </button>
          <button
            className={`profile-nav-btn${tab === "report" ? " active" : ""}`}
            onClick={() => setTab("report")}
          >
            Report
          </button>
        </nav>

        <div className="dashboard-content">
          {tab === "history" && (
            <>
              <h2 className="dashboard-section-title">Last 7 Days</h2>
              {histLoading && <p className="dashboard-empty">Loading…</p>}
              {!histLoading && history.length === 0 && (
                <p className="dashboard-empty">No meals logged in the last 7 days.</p>
              )}
              {history.map(entry => (
                <DayCard key={entry._id} entry={entry} />
              ))}
            </>
          )}

          {tab === "fav-meals" && (
            <>
              <h2 className="dashboard-section-title">Favourite Meals</h2>
              {favLoading && <p className="dashboard-empty">Loading…</p>}
              {!favLoading && favMeals.length === 0 && (
                <p className="dashboard-empty">No favourite meals yet. Hit Create on the Tracker page to save one.</p>
              )}
              {favMeals.map(meal => (
                <FavMealCard key={meal._id} meal={meal} onDelete={handleDeleteFav} />
              ))}
            </>
          )}

          {tab === "report" && (
            <>
              <h2 className="dashboard-section-title">Last 7 Days Report</h2>
              {favLoading && <p className="dashboard-empty">Loading…</p>}
              {!favLoading &&(
                <p className="dashboard-empty">No report generated yet. Complete your meals for the last 7 days to generate a report.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
