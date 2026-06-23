/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const token     = localStorage.getItem("token");
    if (!savedUser || !token) return null;
    const user = JSON.parse(savedUser);
    return {
      userName:  user.name || user.userName || "User",
      targetCal: user.targetCal,
      protein:   user.protein,
      carbs:     user.carbs,
      fat:       user.fat,
    };
  });

  function login(data) {
    setUserData(data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
  }

  return (
    <AuthContext.Provider value={{ userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}