// ================= SIGN-IN FORM =================

// Finds the sign-in form when this script is loaded on the sign-in page.
const signinForm = document.getElementById("signinForm");

// Runs sign-in logic only when the sign-in form exists on the current page.
if (signinForm) {

  // Handles the form submission without reloading the page.
  signinForm.addEventListener("submit", (event) => {
    // Prevents the browser's default form-submission behavior.
    event.preventDefault();

    // Reads the email and password entered by the user.
    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    // Prints the prototype login values for development inspection.
    console.log("Login:", email, password);

    /*
    FUTURE BACKEND INTEGRATION:

    Send the submitted credentials to the login endpoint.
    const response = await fetch(
      `${API_BASE_URL}/auth/login`,
      ...
    );

    Receive and store a JWT after successful authentication.
    */

    // Continues to the prototype dashboard without backend authentication.
    window.location.href = "dashboard.html";
  });

}


// ================= SIGN-UP FORM =================

// Finds the sign-up form when this script is loaded on the sign-up page.
const signupForm = document.getElementById("signupForm");

// Runs registration logic only when the sign-up form exists on the current page.
if (signupForm) {

  // Handles the registration submission without reloading the page.
  signupForm.addEventListener("submit", (event) => {
    // Prevents the browser's default form-submission behavior.
    event.preventDefault();

    // Reads the password entered in the main password field.
    const password =
      document.getElementById("signupPassword").value;

    // Reads the repeated password used for confirmation.
    const confirmPassword =
      document.getElementById("confirmPassword").value;

    // Finds the element used to show registration validation messages.
    const message =
      document.getElementById("formMessage");

    // Stops registration and shows an error when both passwords differ.
    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match.";
      message.className = "form-message error";
      return;
    }

    /*
    FUTURE BACKEND INTEGRATION:

    Send the validated registration details to this endpoint.
    POST /auth/register
    */

    // Sends the user to sign in after the prototype validation succeeds.
    window.location.href = "signin.html";
  });

}
