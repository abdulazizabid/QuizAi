if (!requireAuth()) throw new Error("Authentication required");

const session = readStoredJson("examSession", sessionStorage) || readStoredJson(EXAM_STORAGE_KEY);
if (!session?.questions?.length) {
  window.location.replace("create-exam.html");
  throw new Error("No active exam");
}
sessionStorage.setItem("examSession", JSON.stringify(session));

const questions = session.questions;
const answersStorageKey = `quizgenAnswers:${session.attempt_id}`;
const storedAnswers = readStoredJson(answersStorageKey);
const answers = Array.isArray(storedAnswers) && storedAnswers.length === questions.length
  ? storedAnswers
  : new Array(questions.length).fill("");
let currentQuestion = 0;
let submitting = false;

document.getElementById("materialName").textContent = session.material;
const questionNumber = document.getElementById("questionNumber");
const questionType = document.getElementById("questionType");
const questionText = document.getElementById("questionText");
const answerArea = document.getElementById("answerArea");
const navigator = document.getElementById("questionNavigator");
const timer = document.getElementById("timer");

function renderQuestion() {
  const question = questions[currentQuestion];
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  questionType.textContent = question.type === "mcq" ? "MCQ" : "Short Answer";
  questionText.textContent = question.question;
  answerArea.innerHTML = "";

  if (question.type === "mcq") {
    question.options.forEach((option) => {
      const label = document.createElement("label");
      label.className = "option-item";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = option;
      input.checked = answers[currentQuestion] === option;
      input.addEventListener("change", () => {
        answers[currentQuestion] = option;
        localStorage.setItem(answersStorageKey, JSON.stringify(answers));
        renderNavigator();
      });
      const text = document.createElement("span");
      text.textContent = option;
      label.append(input, text);
      answerArea.appendChild(label);
    });
  } else {
    const textarea = document.createElement("textarea");
    textarea.className = "short-answer";
    textarea.placeholder = "Write your answer here...";
    textarea.value = answers[currentQuestion];
    textarea.addEventListener("input", () => {
      answers[currentQuestion] = textarea.value;
      localStorage.setItem(answersStorageKey, JSON.stringify(answers));
      renderNavigator();
    });
    answerArea.appendChild(textarea);
  }

  document.getElementById("prevBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled = currentQuestion === questions.length - 1;
  renderNavigator();
}

function renderNavigator() {
  navigator.innerHTML = "";
  questions.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = index + 1;
    button.className = "question-nav-btn";
    if (index === currentQuestion) button.classList.add("active");
    if (answers[index].trim()) button.classList.add("answered");
    button.addEventListener("click", () => {
      currentQuestion = index;
      renderQuestion();
    });
    navigator.appendChild(button);
  });
}

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentQuestion > 0) currentQuestion--;
  renderQuestion();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) currentQuestion++;
  renderQuestion();
});

async function submitExam(autoSubmitted = false) {
  if (submitting) return;
  if (!autoSubmitted && !confirm("Are you sure you want to submit the exam?")) return;
  submitting = true;
  clearInterval(timerInterval);
  showLoading("Evaluating your answers", "Checking factual correctness, meaning, calculations, and source evidence...");
  try {
    const result = await apiRequest(`/attempts/${session.attempt_id}/submit`, {
      method: "POST",
      body: JSON.stringify({
        auto_submitted: autoSubmitted,
        answers: questions.map((question, index) => ({
          question_id: question.id,
          answer: answers[index].trim()
        }))
      })
    });
    sessionStorage.setItem("examResult", JSON.stringify(result));
    localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
    sessionStorage.removeItem("examSession");
    localStorage.removeItem(EXAM_STORAGE_KEY);
    localStorage.removeItem(answersStorageKey);
    window.location.href = "result.html";
  } catch (error) {
    hideLoading();
    submitting = false;
    alert(error.message);
  }
}

function updateTimer() {
  const seconds = Math.max(0, Math.ceil((new Date(session.expires_at).getTime() - Date.now()) / 1000));
  const minutes = Math.floor(seconds / 60);
  timer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  if (seconds <= 0) submitExam(true);
}

const timerInterval = setInterval(updateTimer, 1000);
document.getElementById("submitExamBtn").addEventListener("click", () => submitExam(false));
updateTimer();
renderQuestion();
