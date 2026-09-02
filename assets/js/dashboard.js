if (!requireAuth()) throw new Error("Authentication required");

document.getElementById("userName").textContent = getAuth()?.user?.full_name || "Student";

async function loadDashboard() {
  try {
    const data = await apiRequest("/exams/history");
    document.getElementById("totalExams").textContent = data.total_exams;
    document.getElementById("averageScore").textContent = `${data.average_score}%`;
    document.getElementById("bestScore").textContent = `${data.best_score}%`;

    const table = document.getElementById("examTable");
    table.innerHTML = "";
    if (!data.exams.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 4;
      cell.textContent = "No completed exams yet.";
      row.appendChild(cell);
      table.appendChild(row);
      return;
    }
    data.exams.slice(0, 8).forEach((exam) => {
      const row = document.createElement("tr");
      [exam.material, `${exam.score}%`, new Date(exam.date).toLocaleDateString(), exam.status].forEach((value, index) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        if (index === 3) cell.className = "status-completed";
        row.appendChild(cell);
      });
      table.appendChild(row);
    });
  } catch (error) {
    document.getElementById("examTable").innerHTML = `<tr><td colspan="4">${error.message}</td></tr>`;
  }
}

loadDashboard();
