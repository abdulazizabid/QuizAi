// Requires an authenticated session before configuring an exam.
if (!requireAuth()) throw new Error("Authentication required");

// ================= PAGE ELEMENTS =================

// Finds the file picker, drag-and-drop area, and selected-file label.
const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("uploadArea");
const fileName = document.getElementById("fileName");

// Finds the controls used to configure question counts and exam duration.
const mcqCount = document.getElementById("mcqCount");
const shortCount = document.getElementById("shortCount");
const duration = document.getElementById("duration");

// Finds the configuration form and the element used for validation messages.
const examForm = document.getElementById("examForm");
const examMessage = document.getElementById("examMessage");
let pendingMaterial = readStoredJson(MATERIAL_STORAGE_KEY);
let creatingExam = false;
let generatedExam = null;

if (pendingMaterial?.id && pendingMaterial?.filename) {
  fileName.textContent = `Ready: ${pendingMaterial.filename} (already uploaded)`;
}


// ================= FILE-PICKER SELECTION =================

// Updates the interface when a user selects a file with the file picker.
fileInput.addEventListener("change", () => {

  // Displays the first selected file when at least one file is available.
  if (fileInput.files.length > 0) {
    pendingMaterial = null;
    localStorage.removeItem(MATERIAL_STORAGE_KEY);
    showFile(fileInput.files[0]);
  }

});


// Shows the selected file's name inside the upload interface.
function showFile(file) {
  fileName.textContent = `Selected: ${file.name}`;
}


// ================= DRAG-AND-DROP SELECTION =================

// Allows a file to be dropped and applies the active dragging style.
uploadArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadArea.classList.add("dragging");
});

// Removes the dragging style when the pointer leaves the upload area.
uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragging");
});

// Handles a file dropped directly onto the upload area.
uploadArea.addEventListener("drop", (event) => {

  // Prevents the browser from opening the dropped file.
  event.preventDefault();

  // Returns the upload area to its normal visual state.
  uploadArea.classList.remove("dragging");

  // Reads the first file from the drag-and-drop data.
  const file = event.dataTransfer.files[0];

  // Copies the dropped files into the file input and displays the file name.
  if (file) {
    pendingMaterial = null;
    localStorage.removeItem(MATERIAL_STORAGE_KEY);
    fileInput.files = event.dataTransfer.files;

    showFile(file);
  }

});


// ================= EXAM SUMMARY =================

// Reads the form values and refreshes the visible exam summary.
function updateSummary() {

  // Converts input values to numbers and uses zero for empty values.
  const mcq = Number(mcqCount.value) || 0;
  const short = Number(shortCount.value) || 0;
  const time = Number(duration.value) || 0;

  // Displays individual counts and calculates the total number of questions.
  document.getElementById("summaryMcq").textContent = mcq;
  document.getElementById("summaryShort").textContent = short;
  document.getElementById("summaryTotal").textContent =
    mcq + short;

  // Displays the selected duration in the summary.
  document.getElementById("summaryDuration").textContent =
    time;
}


// Keeps the summary synchronized whenever a configuration value changes.
mcqCount.addEventListener("input", updateSummary);
shortCount.addEventListener("input", updateSummary);
duration.addEventListener("input", updateSummary);


// ================= EXAM CREATION =================

// Validates the configuration, uploads the material, and starts the generated exam.
examForm.addEventListener("submit", async (event) => {

  // Prevents the browser from submitting and reloading the form normally.
  event.preventDefault();

  // Clears any validation message left by an earlier submission attempt.
  if (creatingExam) return;
  examMessage.textContent = "";


  // Requires a study-material file before an exam can be created.
  if (fileInput.files.length === 0 && !pendingMaterial?.id) {
    examMessage.textContent =
      "Please upload a study material first.";
    return;
  }


  // Reads the requested MCQ and short-answer counts as numbers.
  const mcq = Number(mcqCount.value);
  const short = Number(shortCount.value);
  const minutes = Number(duration.value);
  if (!Number.isInteger(mcq) || !Number.isInteger(short) || mcq < 0 || short < 0 ||
      mcq > 50 || short > 20 || mcq + short > 50 ||
      !Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
    examMessage.textContent = "Use whole numbers: up to 50 questions total, up to 20 short answers, and 1–180 minutes.";
    return;
  }


  // Requires the exam to contain at least one question.
  if (mcq + short === 0) {
    examMessage.textContent =
      "Please select at least one question.";
    return;
  }


  // Prevents repeat submissions while the backend processes the material.
  const submitButton = examForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  creatingExam = true;
  try {
    showLoading("Reading your material", "Extracting text, formulas, and important topics...");
    let material = pendingMaterial;
    if (!material?.id && fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);
      material = await apiRequest("/materials/upload", {
        method: "POST",
        body: formData,
        timeoutMs: 180000
      });
      pendingMaterial = material;
      localStorage.setItem(MATERIAL_STORAGE_KEY, JSON.stringify(material));
      fileName.textContent = `Ready: ${material.filename} (uploaded)`;
    }

    // Generates an exam using the uploaded material and selected settings.
    showLoading("Generating your exam", "Creating grounded, varied questions from the most important topics...");
    const configuration = JSON.stringify({ material_id: material.id, mcq_count: mcq,
      short_count: short, duration_minutes: minutes });
    const exam = generatedExam?.configuration === configuration ? generatedExam.exam : await apiRequest("/exams/generate", {
      method: "POST",
      timeoutMs: 180000,
      body: configuration
    });
    generatedExam = { configuration, exam };

    // Creates an attempt and saves it for the timed exam page.
    const attempt = await apiRequest(`/exams/${exam.id}/attempts`, { method: "POST", timeoutMs: 30000 });
    if (!attempt.attempt_id || !Array.isArray(attempt.questions) ||
        attempt.questions.filter(q => q.type === "mcq").length !== mcq ||
        attempt.questions.filter(q => q.type === "short").length !== short) {
      throw new Error("The exam response did not match your requested question counts. Please retry.");
    }
    sessionStorage.setItem("examSession", JSON.stringify(attempt));
    localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(attempt));
    sessionStorage.removeItem("examResult");
    localStorage.removeItem(RESULT_STORAGE_KEY);
    window.location.href = `exam.html?attempt=${encodeURIComponent(attempt.attempt_id)}`;
  } catch (error) {
    hideLoading();
    examMessage.textContent = error.message;
    submitButton.disabled = false;
    creatingExam = false;
  }
});
