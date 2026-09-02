if (!requireAuth()) throw new Error("Authentication required");

const user = getAuth()?.user || {};
const displayName = user.full_name || "Student";
document.getElementById("profileName").textContent = displayName;
document.getElementById("profileEmail").textContent = user.email || "";
document.getElementById("infoName").textContent = displayName;
document.getElementById("infoEmail").textContent = user.email || "";
document.getElementById("memberSince").textContent = user.created_at
  ? new Date(user.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })
  : "—";
document.querySelector(".avatar").textContent = displayName.charAt(0).toUpperCase();

document.querySelectorAll(".profile-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".profile-tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".profile-panel").forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

async function loadProfile() {
  try {
    const data = await apiRequest("/exams/history");
    document.getElementById("profileTotalExams").textContent = data.total_exams;
    document.getElementById("profileAverage").textContent = `${data.average_score}%`;
    document.getElementById("profileBest").textContent = `${data.best_score}%`;

    const chart = document.getElementById("progressChart");
    const table = document.getElementById("historyTable");
    chart.innerHTML = "";
    table.innerHTML = "";

    data.exams.slice().reverse().slice(-7).forEach((exam, index) => {
      const item = document.createElement("div");
      item.className = "chart-item";
      const area = document.createElement("div");
      area.className = "chart-bar-area";
      const bar = document.createElement("div");
      bar.className = "chart-bar";
      bar.style.height = `${Math.max(0, Math.min(100, exam.score))}%`;
      area.appendChild(bar);
      const score = document.createElement("span");
      score.className = "chart-score";
      score.textContent = `${exam.score}%`;
      const label = document.createElement("span");
      label.className = "chart-label";
      label.textContent = `Exam ${index + 1}`;
      item.append(area, score, label);
      chart.appendChild(item);
    });

    data.exams.forEach((exam) => {
      const row = document.createElement("tr");
      [exam.material, `${exam.score}%`, new Date(exam.date).toLocaleDateString()].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });
      table.appendChild(row);
    });
  } catch (error) {
    document.getElementById("historyTable").innerHTML = `<tr><td colspan="3">${error.message}</td></tr>`;
  }
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  clearAuth();
  sessionStorage.removeItem("examSession");
  window.location.href = "../index.html";
});

loadProfile();
