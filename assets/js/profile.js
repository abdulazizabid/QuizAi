// ================= USER DATA =================

const user = {
  name: "Student",
  email: "student@example.com"
};


document.getElementById("profileName").textContent =
  user.name;

document.getElementById("profileEmail").textContent =
  user.email;

document.getElementById("infoName").textContent =
  user.name;

document.getElementById("infoEmail").textContent =
  user.email;


// ================= PROFILE TABS =================

const tabs =
  document.querySelectorAll(".profile-tab");

const panels =
  document.querySelectorAll(".profile-panel");


tabs.forEach((tab) => {

  tab.addEventListener("click", () => {

    tabs.forEach(item =>
      item.classList.remove("active")
    );

    panels.forEach(panel =>
      panel.classList.remove("active")
    );


    tab.classList.add("active");


    document
      .getElementById(tab.dataset.tab)
      .classList.add("active");

  });

});


// ================= EXAM HISTORY =================

let history = JSON.parse(
  localStorage.getItem("quizgenHistory")
) || [];


// Temporary demo data

if (history.length === 0) {

  history = [
    {
      material: "Data Structures.pdf",
      score: 85,
      date: "12/08/2026"
    },

    {
      material: "Operating Systems.pdf",
      score: 72,
      date: "10/08/2026"
    },

    {
      material: "Machine Learning.pdf",
      score: 91,
      date: "08/08/2026"
    }
  ];
}


// ================= STATISTICS =================

const scores =
  history.map(exam => Number(exam.score));


const average =
  scores.length
    ? Math.round(
        scores.reduce((a, b) => a + b, 0) /
        scores.length
      )
    : 0;


const best =
  scores.length
    ? Math.max(...scores)
    : 0;


document.getElementById("profileTotalExams").textContent =
  history.length;

document.getElementById("profileAverage").textContent =
  `${average}%`;

document.getElementById("profileBest").textContent =
  `${best}%`;


// ================= PROGRESS GRAPH =================

const chart =
  document.getElementById("progressChart");


history
  .slice()
  .reverse()
  .slice(-7)
  .forEach((exam, index) => {

    const item =
      document.createElement("div");

    item.className = "chart-item";


    item.innerHTML = `

      <div class="chart-bar-area">

        <div
          class="chart-bar"
          style="height: ${exam.score}%">
        </div>

      </div>

      <span class="chart-score">
        ${exam.score}%
      </span>

      <span class="chart-label">
        Exam ${index + 1}
      </span>

    `;


    chart.appendChild(item);

  });


// ================= HISTORY TABLE =================

const historyTable =
  document.getElementById("historyTable");


history.forEach((exam) => {

  const row =
    document.createElement("tr");

  row.innerHTML = `
    <td>${exam.material}</td>
    <td>${exam.score}%</td>
    <td>${exam.date}</td>
  `;

  historyTable.appendChild(row);

});


// ================= LOGOUT =================

document
  .getElementById("logoutBtn")
  .addEventListener("click", () => {

    /*
    JWT logout will be handled
    by the backend later.
    */

    window.location.href =
      "signin.html";

  });


/*
BACKEND LATER:

GET /users/me
GET /users/progress
GET /exams/history
*/