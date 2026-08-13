// ================= EXAM CONFIG =================

const config = JSON.parse(
  sessionStorage.getItem("examConfig")
) || {
  file: "Sample Material.pdf",
  mcqCount: 3,
  shortCount: 2,
  duration: 10
};


document.getElementById("materialName").textContent =
  config.file;


// ================= MOCK QUESTIONS =================

const mcqPool = [
  {
    question: "Which data structure follows FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctAnswer: "Queue",
    explanation: "A queue follows the First-In-First-Out principle.",
    source: "Uploaded material - Page 4"
  },

  {
    question: "Which data structure follows LIFO?",
    options: ["Queue", "Array", "Stack", "Graph"],
    correctAnswer: "Stack",
    explanation: "A stack follows the Last-In-First-Out principle.",
    source: "Uploaded material - Page 6"
  },

  {
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Processing Utility",
      "Central Program Unit",
      "Computer Primary Unit"
    ],
    correctAnswer: "Central Processing Unit",
    explanation: "CPU stands for Central Processing Unit.",
    source: "Uploaded material - Page 8"
  }
];


const shortPool = [
  {
    question: "Explain the difference between a stack and a queue.",
    correctAnswer:
      "A stack follows LIFO while a queue follows FIFO.",
    explanation:
      "Stacks remove the most recently added item, while queues remove the earliest added item.",
    source: "Uploaded material - Page 10"
  },

  {
    question: "What is the purpose of an operating system?",
    correctAnswer:
      "It manages computer hardware and software resources.",
    explanation:
      "The operating system manages resources and provides services for programs.",
    source: "Uploaded material - Page 12"
  }
];


const questions = [];


// Create requested MCQs

for (let i = 0; i < config.mcqCount; i++) {

  const data = mcqPool[i % mcqPool.length];

  questions.push({
    ...data,
    type: "mcq"
  });
}


// Create requested Short Questions

for (let i = 0; i < config.shortCount; i++) {

  const data = shortPool[i % shortPool.length];

  questions.push({
    ...data,
    type: "short"
  });
}


// ================= STATE =================

let currentQuestion = 0;

const answers = new Array(questions.length).fill("");


// ================= ELEMENTS =================

const questionNumber =
  document.getElementById("questionNumber");

const questionType =
  document.getElementById("questionType");

const questionText =
  document.getElementById("questionText");

const answerArea =
  document.getElementById("answerArea");

const navigator =
  document.getElementById("questionNavigator");


// ================= DISPLAY QUESTION =================

function renderQuestion() {

  const question = questions[currentQuestion];

  questionNumber.textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  questionType.textContent =
    question.type === "mcq"
      ? "MCQ"
      : "Short Answer";

  questionText.textContent =
    question.question;

  answerArea.innerHTML = "";


  // MCQ

  if (question.type === "mcq") {

    question.options.forEach((option) => {

      const label = document.createElement("label");

      label.className = "option-item";

      label.innerHTML = `
        <input
          type="radio"
          name="answer"
          value="${option}"
          ${answers[currentQuestion] === option ? "checked" : ""}
        >

        <span>${option}</span>
      `;

      label
        .querySelector("input")
        .addEventListener("change", () => {

          answers[currentQuestion] = option;

          renderNavigator();
        });

      answerArea.appendChild(label);

    });

  }

  // Short Answer

  else {

    const textarea =
      document.createElement("textarea");

    textarea.className = "short-answer";

    textarea.placeholder =
      "Write your answer here...";

    textarea.value =
      answers[currentQuestion];

    textarea.addEventListener("input", () => {

      answers[currentQuestion] =
        textarea.value;

      renderNavigator();

    });

    answerArea.appendChild(textarea);

  }


  document.getElementById("prevBtn").disabled =
    currentQuestion === 0;

  document.getElementById("nextBtn").disabled =
    currentQuestion === questions.length - 1;

  renderNavigator();
}


// ================= NAVIGATOR =================

function renderNavigator() {

  navigator.innerHTML = "";

  questions.forEach((_, index) => {

    const button =
      document.createElement("button");

    button.textContent = index + 1;

    button.className =
      "question-nav-btn";

    if (index === currentQuestion) {
      button.classList.add("active");
    }

    if (answers[index].trim() !== "") {
      button.classList.add("answered");
    }

    button.addEventListener("click", () => {

      currentQuestion = index;

      renderQuestion();

    });

    navigator.appendChild(button);

  });

}


// ================= PREVIOUS / NEXT =================

document
  .getElementById("prevBtn")
  .addEventListener("click", () => {

    if (currentQuestion > 0) {

      currentQuestion--;

      renderQuestion();
    }

  });


document
  .getElementById("nextBtn")
  .addEventListener("click", () => {

    if (currentQuestion < questions.length - 1) {

      currentQuestion++;

      renderQuestion();
    }

  });


// ================= TIMER =================

let remainingSeconds =
  config.duration * 60;

const timer =
  document.getElementById("timer");


function updateTimer() {

  const minutes =
    Math.floor(remainingSeconds / 60);

  const seconds =
    remainingSeconds % 60;

  timer.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


const timerInterval = setInterval(() => {

  remainingSeconds--;

  updateTimer();

  if (remainingSeconds <= 0) {

    clearInterval(timerInterval);

    submitExam(true);
  }

}, 1000);


// ================= SUBMIT EXAM =================

function submitExam(autoSubmit = false) {

  if (!autoSubmit) {

    const confirmed =
      confirm("Are you sure you want to submit the exam?");

    if (!confirmed) {
      return;
    }
  }


  clearInterval(timerInterval);


  let correctCount = 0;


  const results = questions.map((question, index) => {

    const userAnswer =
      answers[index].trim();

    let correct = false;


    if (question.type === "mcq") {

      correct =
        userAnswer === question.correctAnswer;

    } else {

      /*
      Temporary frontend evaluation.

      Later FastAPI + AI will evaluate
      short answers properly.
      */

      correct =
        userAnswer.length >= 10;
    }


    if (correct) {
      correctCount++;
    }


    return {
      ...question,
      userAnswer,
      correct
    };

  });


  const score =
    questions.length === 0
      ? 0
      : Math.round(
          (correctCount / questions.length) * 100
        );


  const examResult = {

    id: Date.now(),

    material: config.file,

    date: new Date().toLocaleDateString(),

    score,

    correctCount,

    totalQuestions: questions.length,

    autoSubmitted: autoSubmit,

    results
  };


  sessionStorage.setItem(
    "examResult",
    JSON.stringify(examResult)
  );


  window.location.href =
    "result.html";
}


// Manual submit

document
  .getElementById("submitExamBtn")
  .addEventListener("click", () => {

    submitExam(false);

  });


// ================= START =================

updateTimer();
renderQuestion();