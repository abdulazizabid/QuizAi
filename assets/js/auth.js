// ================= SIGN IN =================

const signinForm = document.getElementById("signinForm");

if (signinForm) {

  signinForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    console.log("Login:", email, password);

    /*
    BACKEND LATER:

    const response = await fetch(
      `${API_BASE_URL}/auth/login`,
      ...
    );

    Receive JWT after successful login.
    */

    window.location.href = "dashboard.html";
  });

}


// ================= SIGN UP =================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const password =
      document.getElementById("signupPassword").value;

    const confirmPassword =
      document.getElementById("confirmPassword").value;

    const message =
      document.getElementById("formMessage");

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match.";
      message.className = "form-message error";
      return;
    }

    /*
    BACKEND LATER:

    POST /auth/register
    */

    window.location.href = "signin.html";
  });

}