import { useState, useEffect } from "react";
import LandingPage from "../pages/LandingPage";
import AuthScreen from "../pages/AuthScreen";
import TrackerDashboard from "../pages/TrackerDashboard";
import UserProfile from "../pages/UserProfile";

export default function AppRouter() {
  const [page,     setPage]     = useState("landing");
  const [userData, setUserData] = useState(null);
  const [authMode, setAuthMode] = useState("signup");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token     = localStorage.getItem("token");
    if (savedUser && token) {
      const user = JSON.parse(savedUser);
      setUserData({
        userName:  user.name || user.userName || "User",
        targetCal: user.targetCal,
        protein:   user.protein,
        carbs:     user.carbs,
        fat:       user.fat,
      });
      setPage("tracker");
    }
  }, []);

  function handleStartTracking(data) {
    localStorage.setItem("healthMetrics", JSON.stringify({
      userName:  data.userName,
      targetCal: data.targetCal,
      protein:   data.protein,
      carbs:     data.carbs,
      fat:       data.fat,
    }));
    setUserData(data);
    setAuthMode("signup");
    setPage("auth");
  }

  function handleAuthSuccess(data) {
    setUserData(data);
    setPage("tracker");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
    setAuthMode("login");
    setPage("auth");
  }

  if (page === "auth") {
    const saved      = localStorage.getItem("healthMetrics");
    const healthData = saved ? JSON.parse(saved) : userData;
    return (
      <AuthScreen
        userData={healthData}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setPage("landing")}
      />
    );
  }

  if (page === "tracker" && !userData) {
    const saved      = localStorage.getItem("healthMetrics");
    const healthData = saved ? JSON.parse(saved) : null;
    return (
      <AuthScreen
        userData={healthData}
        initialMode="login"
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setPage("landing")}
      />
    );
  }

  if (page === "tracker" && userData) {
    return (
      <TrackerDashboard
        userName={userData.userName}
        targetCal={userData.targetCal}
        targetProtein={userData.protein}
        targetCarbs={userData.carbs}
        targetFat={userData.fat}
        onLogout={handleLogout}
      />
    );
  }

  return <LandingPage onStartTracking={handleStartTracking} />;
}
