// ================= SIGN IN =================

if (isAuthenticated()) window.location.replace("dashboard.html");

const signinForm = document.getElementById("signinForm");

if (signinForm) {

  signinForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    const message = document.getElementById("formMessage");
    message.textContent = "Signing in...";
    try {
      const auth = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      saveAuth(auth);
      window.location.href = "dashboard.html";
    } catch (error) {
      message.textContent = error.message;
      message.className = "form-message error";
    }
  });

}


// ================= SIGN UP =================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", async (event) => {
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

    message.textContent = "Creating account...";
    try {
      const auth = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: document.getElementById("fullName").value.trim(),
          email: document.getElementById("signupEmail").value.trim(),
          password
        })
      });

      if (auth.access_token) {
        saveAuth(auth);
        window.location.href = "dashboard.html";
      } else {
        message.textContent = auth.message;
        message.className = "form-message success";
      }
    } catch (error) {
      message.textContent = error.message;
      message.className = "form-message error";
    }
  });

}
