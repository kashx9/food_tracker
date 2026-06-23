import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { NavBar } from '../components/NavBar';
import './UserProfile.css';

const mockMeals = [
  {
    name: "My Oats",
    category: "Breakfast",
    ingredients: [
      { name: "Oats",           quantity: "100g",  calories: "389 kcal", protein: "17g", carbs: "66g", fats: "7g"  },
      { name: "Chocolate Milk", quantity: "200ml", calories: "148 kcal", protein: "8g",  carbs: "18g", fats: "5g"  },
    ],
  },
  {
    name: "Mom Ka Bhindi",
    category: "Lunch",
    ingredients: [
      { name: "Bhindi / Lady's Finger", quantity: "150g", calories: "50 kcal", protein: "2g", carbs: "10g", fats: "0g"  },
      { name: "Mustard Oil",            quantity: "10ml",  calories: "88 kcal", protein: "0g", carbs: "0g",  fats: "10g" },
    ],
  },
  {
    name: "Gym Shake",
    category: "Shakes",
    ingredients: [
      { name: "Whey Protein", quantity: "30g",      calories: "120 kcal", protein: "24g", carbs: "3g",  fats: "2g" },
      { name: "Banana",       quantity: "1 medium", calories: "89 kcal",  protein: "1g",  carbs: "23g", fats: "0g" },
    ],
  },
];

export default function UserProfile() {
  const { userData, logout } = useAuth();
  const navigate             = useNavigate();
  const [selected, setSelected] = useState("profile");

  const name      = userData?.userName || "User";
  const initials  = name.slice(0, 2).toUpperCase();
  const targetCalories = userData?.targetCal;
  const dateLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });

  function handleLogout() {
    logout();
    navigate("/auth?mode=login");
  }

  return (
    <div className="profile-page">
      <NavBar
        onLogout={handleLogout}
        middleSlot={
          <>
            <button onClick={() => navigate("/tracker")}>Tracker</button>
            <button className="active">Profile</button>
          </>
        }
        rightSlot={<span className="date-label">{dateLabel}</span>}
      />

      <div className="profile-body">

        {/* Left nav */}
        <nav className="profile-nav">
          <button
            className={`profile-nav-btn${selected === "profile" ? " active" : ""}`}
            onClick={() => setSelected("profile")}
          >
            Profile
          </button>
          <button
            className={`profile-nav-btn${selected === "fav-meals" ? " active" : ""}`}
            onClick={() => setSelected("fav-meals")}
          >
            Fav Meals
          </button>
        </nav>

        {/* Right content */}
        <div>
          {selected === "profile" && (
            <div className="profile-card">
              <div className="profile-avatar">{initials}</div>
              <div>
                <p className="profile-info-name">{name}</p>
                <p className="profile-info-email">Email : kashyappayush@gmail.com</p>
                <p className="profile-info-email">Target : {targetCalories}</p>
              </div>
            </div>
          )}

          {selected === "fav-meals" && (
            <div>
              <h2 className="fav-meals-heading">Favourite Meals</h2>
              {mockMeals.map((meal) => (
                <div key={meal.name} className="fav-meal-card">
                  <div className="fav-meal-header">
                    <span className="fav-meal-name">{meal.name}</span>
                    <span className={`fav-meal-category category--${meal.category.toLowerCase()}`}>
                      {meal.category}
                    </span>
                  </div>
                  {meal.ingredients.map((ing) => (
                    <div key={ing.name} className="fav-meal-ingredient">
                      <div className="fav-meal-ingredient-left">
                        <span className="fav-meal-ingredient-name">{ing.name}</span>
                        <span className="fav-meal-ingredient-qty">{ing.quantity}</span>
                      </div>
                      <div className="fav-meal-ingredient-macros">
                        <span className="fav-macro-cal">{ing.calories}</span>
                        <span className="fav-macro-protein">P {ing.protein}</span>
                        <span className="fav-macro-carbs">C {ing.carbs}</span>
                        <span className="fav-macro-fat">F {ing.fats}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
