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


// ================= FILE-PICKER SELECTION =================

// Updates the interface when a user selects a file with the file picker.
fileInput.addEventListener("change", () => {

  // Displays the first selected file when at least one file is available.
  if (fileInput.files.length > 0) {
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

// Validates the configuration and starts the prototype exam flow.
examForm.addEventListener("submit", (event) => {

  // Prevents the browser from submitting and reloading the form normally.
  event.preventDefault();

  // Clears any validation message left by an earlier submission attempt.
  examMessage.textContent = "";


  // Requires a study-material file before an exam can be created.
  if (fileInput.files.length === 0) {
    examMessage.textContent =
      "Please upload a study material first.";
    return;
  }


  // Reads the requested MCQ and short-answer counts as numbers.
  const mcq = Number(mcqCount.value);
  const short = Number(shortCount.value);


  // Requires the exam to contain at least one question.
  if (mcq + short === 0) {
    examMessage.textContent =
      "Please select at least one question.";
    return;
  }


  // Collects the selected file name and settings into one configuration object.
  const examConfig = {
    file: fileInput.files[0].name,
    mcqCount: mcq,
    shortCount: short,
    duration: Number(duration.value)
  };


  // Prints the completed configuration for development inspection.
  console.log("Exam configuration:", examConfig);


  /*
  FUTURE BACKEND INTEGRATION:

  1. Upload the selected document.

     POST /materials/upload

  2. Generate an examination from the uploaded material.

     POST /exams/generate

  const formData = new FormData();

  formData.append(
    "file",
    fileInput.files[0]
  );

  Then send the selected question counts and duration.
  */


// Saves the configuration for use by the exam page during this browser session.
sessionStorage.setItem(
  "examConfig",
  JSON.stringify(examConfig)
);

// Opens the timed exam page after the configuration is saved.
window.location.href = "exam.html";

});
