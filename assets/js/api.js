// ================= API CONFIGURATION =================

// Stores the common backend address that future API requests will use.
const API_BASE_URL = "http://localhost:8000";

/*
Planned backend routes grouped by responsibility:

Authentication:
POST /auth/register
POST /auth/login

Current user information:
GET /users/me

Material upload and exam generation:
POST /materials/upload
POST /exams/generate

Exam records and progress statistics:
GET /exams/history
GET /users/progress
*/


// Example reusable request helper for future backend integration.

// async function apiRequest(endpoint, options = {}) {
//   // Sends a request to the selected endpoint using the shared base URL.
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
//
//   // Stops processing and reports an error when the response is unsuccessful.
//   if (!response.ok) {
//     throw new Error("API request failed");
//   }
//
//   // Converts a successful JSON response into a JavaScript value.
//   return response.json();
// }
