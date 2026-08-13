// ================= API CONFIG =================

const API_BASE_URL = "http://localhost:8000";

/*
Future API functions:

POST /auth/register
POST /auth/login

GET /users/me

POST /materials/upload
POST /exams/generate

GET /exams/history
GET /users/progress
*/


// Example for later:

// async function apiRequest(endpoint, options = {}) {
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
//
//   if (!response.ok) {
//     throw new Error("API request failed");
//   }
//
//   return response.json();
// }