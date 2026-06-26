const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

function authHeaders() {
  return {
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };
}

export async function login(email, password) {
  return fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name, email, password) {
  return fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
}

export async function fetchFoods() {
  return fetch(`${BASE}/foods`);
}

export async function fetchMeals(date) {
  return fetch(`${BASE}/meals/${date}`, { headers: authHeaders() });
}

export async function addMeal(date, mealType, item) {
  return fetch(`${BASE}/meals`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ date, mealType, item }),
  });
}

export async function deleteMeal(mealDocId, section, itemId) {
  return fetch(`${BASE}/meals/${mealDocId}/${section}/${itemId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export async function fetchUser(userId) {
  return fetch(`${BASE}/users/${userId}`, { headers: authHeaders() });
}

export async function updateUserTargets(userId, targets) {
  return fetch(`${BASE}/users/${userId}/targets`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(targets),
  });
}
