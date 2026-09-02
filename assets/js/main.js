const authSection = document.querySelector(".auth-section");

if (authSection && isAuthenticated()) {
  authSection.innerHTML = `
    <a href="./pages/dashboard.html" class="nav-btn">Dashboard</a>
    <a href="./pages/profile.html" class="cta-button">My Profile</a>
  `;
}

document.querySelectorAll(".benefit-card").forEach((card) => {
  card.setAttribute("role", "link");
  card.setAttribute("tabindex", "0");
  const navigate = () => {
    window.location.href = isAuthenticated()
      ? "./pages/create-exam.html"
      : "./pages/signin.html";
  };
  card.addEventListener("click", navigate);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") navigate();
  });
});
