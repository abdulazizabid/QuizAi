const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("uploadArea");
const fileName = document.getElementById("fileName");

const mcqCount = document.getElementById("mcqCount");
const shortCount = document.getElementById("shortCount");
const duration = document.getElementById("duration");

const examForm = document.getElementById("examForm");
const examMessage = document.getElementById("examMessage");


// ================= FILE SELECTION =================

fileInput.addEventListener("change", () => {

  if (fileInput.files.length > 0) {
    showFile(fileInput.files[0]);
  }

});


function showFile(file) {
  fileName.textContent = `Selected: ${file.name}`;
}


// ================= DRAG & DROP =================

uploadArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadArea.classList.add("dragging");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragging");
});

uploadArea.addEventListener("drop", (event) => {

  event.preventDefault();

  uploadArea.classList.remove("dragging");

  const file = event.dataTransfer.files[0];

  if (file) {

    fileInput.files = event.dataTransfer.files;

    showFile(file);
  }

});


// ================= SUMMARY =================

function updateSummary() {

  const mcq = Number(mcqCount.value) || 0;
  const short = Number(shortCount.value) || 0;
  const time = Number(duration.value) || 0;

  document.getElementById("summaryMcq").textContent = mcq;
  document.getElementById("summaryShort").textContent = short;
  document.getElementById("summaryTotal").textContent =
    mcq + short;

  document.getElementById("summaryDuration").textContent =
    time;
}


mcqCount.addEventListener("input", updateSummary);
shortCount.addEventListener("input", updateSummary);
duration.addEventListener("input", updateSummary);


// ================= GENERATE EXAM =================

examForm.addEventListener("submit", (event) => {

  event.preventDefault();

  examMessage.textContent = "";


  if (fileInput.files.length === 0) {
    examMessage.textContent =
      "Please upload a study material first.";
    return;
  }


  const mcq = Number(mcqCount.value);
  const short = Number(shortCount.value);


  if (mcq + short === 0) {
    examMessage.textContent =
      "Please select at least one question.";
    return;
  }


  const examConfig = {
    file: fileInput.files[0].name,
    mcqCount: mcq,
    shortCount: short,
    duration: Number(duration.value)
  };


  console.log("Exam configuration:", examConfig);


  /*
  BACKEND LATER:

  1. Upload document

     POST /materials/upload

  2. Generate examination

     POST /exams/generate

  const formData = new FormData();

  formData.append(
    "file",
    fileInput.files[0]
  );

  Then send question configuration.
  */


sessionStorage.setItem(
  "examConfig",
  JSON.stringify(examConfig)
);

window.location.href = "exam.html";

});