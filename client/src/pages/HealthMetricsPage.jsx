import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { HealthCalculator } from "../components/HealthCalculator";
import { NavBar } from "../components/NavBar";
import { updateUserTargets } from "../utils/api";
import "./HealthMetricsPage.css";

export default function HealthMetricsPage() {
  const { userData, login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSaveTargets({ targetCal, protein, carbs, fat }) {
    setLoading(true);
    setError("");
    try {
      const res  = await updateUserTargets(userData.userId, { calories: targetCal, protein, carbs, fat });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to save targets.");
        return;
      }
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...savedUser, calories: targetCal, protein, carbs, fat }));
      authLogin({ ...userData, targetCal, protein, carbs, fat });
      navigate("/tracker");
    } catch {
      setError("Could not connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="metrics-page">
      <NavBar />
      <div className="metrics-body">
        <div className="metrics-header">
          <h1 className="metrics-title">Set Your Daily Targets</h1>
          <p className="metrics-subtitle">
            Fill in your details to calculate your personalised calorie and macro targets.
          </p>
        </div>
        <HealthCalculator onStartTracking={handleSaveTargets} loading={loading} />
        {error && <p className="metrics-error">{error}</p>}
      </div>
    </div>
  );
}
