// ================= API CONFIG =================

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";
const AUTH_STORAGE_KEY = "quizgenAuth";

function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
  } catch {
    return null;
  }
}

function saveAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function isAuthenticated() {
  return Boolean(getAuth()?.access_token);
}

async function apiRequest(path, options = {}) {
  const auth = getAuth();
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (auth?.access_token) headers.Authorization = `Bearer ${auth.access_token}`;

  let response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (response.status === 401 && auth?.refresh_token && path !== "/auth/refresh") {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: auth.refresh_token })
    });
    if (refreshResponse.ok) {
      const renewed = await refreshResponse.json();
      saveAuth(renewed);
      headers.Authorization = `Bearer ${renewed.access_token}`;
      response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    } else {
      clearAuth();
    }
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || "Request failed");
  return data;
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.replace("signin.html");
    return false;
  }
  return true;
}

function showLoading(title, detail) {
  let overlay = document.getElementById("loadingOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "loadingOverlay";
    overlay.className = "loading-overlay";
    overlay.innerHTML = `<div class="loading-card"><div class="spinner"></div><h2></h2><p></p></div>`;
    document.body.appendChild(overlay);
  }
  overlay.querySelector("h2").textContent = title;
  overlay.querySelector("p").textContent = detail;
  overlay.hidden = false;
}

function hideLoading() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.hidden = true;
}
