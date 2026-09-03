// ================= API CONFIGURATION =================

// Stores the common backend address that API requests use.
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";
const AUTH_STORAGE_KEY = "quizgenAuth";
const MATERIAL_STORAGE_KEY = "quizgenPendingMaterial";
const EXAM_STORAGE_KEY = "quizgenExamSession";
const RESULT_STORAGE_KEY = "quizgenExamResult";

function readStoredJson(key, storage = localStorage) {
  try {
    return JSON.parse(storage.getItem(key));
  } catch {
    storage.removeItem(key);
    return null;
  }
}

function clearWorkflowState() {
  localStorage.removeItem(MATERIAL_STORAGE_KEY);
  localStorage.removeItem(EXAM_STORAGE_KEY);
  localStorage.removeItem(RESULT_STORAGE_KEY);
  Object.keys(localStorage)
    .filter((key) => key.startsWith("quizgenAnswers:"))
    .forEach((key) => localStorage.removeItem(key));
  sessionStorage.removeItem("examSession");
  sessionStorage.removeItem("examResult");
}

// Reads the current authentication details from browser storage.
function getAuth() {
  return readStoredJson(AUTH_STORAGE_KEY);
}

// Saves or clears the active user's authentication details.
function saveAuth(auth) {
  const existingUserId = getAuth()?.user?.id;
  if (existingUserId && existingUserId !== auth?.user?.id) clearWorkflowState();
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  clearWorkflowState();
}

function isAuthenticated() {
  return Boolean(getAuth()?.access_token);
}

function redirectToSignIn() {
  if (!window.location.pathname.endsWith("/signin.html")) {
    const target = window.location.pathname.includes("/pages/")
      ? "signin.html"
      : "pages/signin.html";
    window.location.replace(target);
  }
}

// Sends an authenticated request to the backend and refreshes expired access tokens.
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
      redirectToSignIn();
      throw new Error("Your session expired. Please sign in again.");
    }
  }

  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && path !== "/auth/login") {
    clearAuth();
    redirectToSignIn();
  }
  if (!response.ok) throw new Error(data.detail || "Request failed");
  return data;
}

// Redirects visitors who do not have an authenticated session.
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.replace("signin.html");
    return false;
  }
  return true;
}

// Displays a reusable loading overlay during longer backend operations.
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
