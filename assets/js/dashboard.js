// ================= MOCK DASHBOARD DATA =================

const dashboardData = {
  user: "Student",
  totalExams: 3,
  averageScore: 82,
  bestScore: 91,

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


// ================= DISPLAY DATA =================

document.getElementById("userName").textContent =
  dashboardData.user;

document.getElementById("totalExams").textContent =
  dashboardData.totalExams;

document.getElementById("averageScore").textContent =
  `${dashboardData.averageScore}%`;

document.getElementById("bestScore").textContent =
  `${dashboardData.bestScore}%`;


// ================= RECENT EXAMS =================

const examTable = document.getElementById("examTable");

dashboardData.exams.forEach((exam) => {

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${exam.material}</td>
    <td>${exam.score}</td>
    <td>${exam.date}</td>
    <td class="status-completed">Completed</td>
  `;

  examTable.appendChild(row);

});


/*
BACKEND LATER:

GET /users/me
GET /exams/history
GET /users/progress
*/


// ================= LOGOUT =================

document
  .getElementById("logoutBtn")
  .addEventListener("click", () => {

    /*
    Later:
    Remove/expire authentication.
    */

    window.location.href = "signin.html";

  });