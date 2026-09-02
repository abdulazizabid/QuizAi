// ================= PROTOTYPE DASHBOARD DATA =================

// Provides temporary user statistics and exam records until backend integration.
const dashboardData = {
  user: "Student",
  totalExams: 3,
  averageScore: 82,
  bestScore: 91,

  // Stores the sample exams displayed in the recent-exams table.
  exams: [
    {
      material: "Data Structures.pdf",
      score: "85%",
      date: "12 Aug 2026"
    },
    {
      material: "Operating Systems.pdf",
      score: "70%",
      date: "10 Aug 2026"
    },
    {
      material: "Machine Learning.pdf",
      score: "91%",
      date: "8 Aug 2026"
    }
  ]
};


// ================= DASHBOARD SUMMARY =================

// Displays the prototype user's name in the dashboard greeting.
document.getElementById("userName").textContent =
  dashboardData.user;

// Displays the total number of completed examinations.
document.getElementById("totalExams").textContent =
  dashboardData.totalExams;

// Displays the average score with a percentage symbol.
document.getElementById("averageScore").textContent =
  `${dashboardData.averageScore}%`;

// Displays the user's highest score with a percentage symbol.
document.getElementById("bestScore").textContent =
  `${dashboardData.bestScore}%`;


// ================= RECENT-EXAMS TABLE =================

// Finds the table body where recent examination rows will be inserted.
const examTable = document.getElementById("examTable");

// Creates and displays one table row for every sample examination.
dashboardData.exams.forEach((exam) => {

  // Creates a new table-row element for the current exam record.
  const row = document.createElement("tr");

  // Builds the cells for material, score, date, and completion status.
  row.innerHTML = `
    <td>${exam.material}</td>
    <td>${exam.score}</td>
    <td>${exam.date}</td>
    <td class="status-completed">Completed</td>
  `;

  // Adds the completed row to the recent-exams table.
  examTable.appendChild(row);

});


/*
FUTURE BACKEND INTEGRATION:

Replace the prototype object with authenticated user details,
exam history, and calculated progress from these endpoints:
GET /users/me
GET /exams/history
GET /users/progress
*/


// ================= LOGOUT ACTION =================

// Listens for the user to select the dashboard's logout button.
document
  .getElementById("logoutBtn")
  .addEventListener("click", () => {

    /*
    FUTURE AUTHENTICATION CLEANUP:
    Remove stored credentials or expire the active user session.
    */

    // Returns the user to the sign-in page in the current prototype.
    window.location.href = "signin.html";

  });
