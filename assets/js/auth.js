// ================= SIGN-IN FORM =================

if (isAuthenticated()) window.location.replace("dashboard.html");

// Finds the sign-in form when this script is loaded on the sign-in page.
const signinForm = document.getElementById("signinForm");

// Runs sign-in logic only when the sign-in form exists on the current page.
if (signinForm) {
  // Handles the form submission without reloading the page.
  signinForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Reads the credentials entered by the user.
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

// ================= SIGN-UP FORM =================

// Finds the sign-up form when this script is loaded on the sign-up page.
const signupForm = document.getElementById("signupForm");

// Runs registration logic only when the sign-up form exists on the current page.
if (signupForm) {
  // Handles the registration submission without reloading the page.
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("formMessage");

    // Stops registration and shows an error when both passwords differ.
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
