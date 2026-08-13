const examResult = JSON.parse(
  sessionStorage.getItem("examResult")
);


const resultContainer =
  document.getElementById("resultContainer");


if (!examResult) {

  resultContainer.innerHTML = `
    <div class="review-card">
      <p>No exam result found.</p>
    </div>
  `;

} else {

  // ================= SUMMARY =================

  document.getElementById("resultMaterial").textContent =
    examResult.material;

  document.getElementById("score").textContent =
    `${examResult.score}%`;

  document.getElementById("correctCount").textContent =
    examResult.correctCount;

  document.getElementById("totalQuestions").textContent =
    examResult.totalQuestions;


  // ================= SAFE TEXT =================

  function escapeHTML(text) {

    const element =
      document.createElement("div");

    element.textContent =
      text || "Not answered";

    return element.innerHTML;
  }


  // ================= REVIEW =================

  examResult.results.forEach((item, index) => {

    const card =
      document.createElement("article");

    card.className =
      `review-card ${item.correct ? "correct" : "incorrect"}`;


    card.innerHTML = `

      <div class="review-top">

        <strong>
          Question ${index + 1}
        </strong>

        <span class="review-status">
          ${item.correct ? "✓ Correct" : "✗ Incorrect"}
        </span>

      </div>

      <h3>
        ${escapeHTML(item.question)}
      </h3>


      <div class="answer-block">

        <span>Your Answer</span>

        <p>
          ${escapeHTML(item.userAnswer)}
        </p>

      </div>


      <div class="answer-block">

        <span>Expected Answer</span>

        <p>
          ${escapeHTML(item.correctAnswer)}
        </p>

      </div>


      <div class="explanation-box">

        <strong>Explanation</strong>

        <p>
          ${escapeHTML(item.explanation)}
        </p>

      </div>


      <div class="source-reference">
        📖 ${escapeHTML(item.source)}
      </div>

    `;


    resultContainer.appendChild(card);

  });


  // ================= SAVE HISTORY =================

  const history =
    JSON.parse(
      localStorage.getItem("quizgenHistory")
    ) || [];


  const alreadySaved =
    history.some(
      exam => exam.id === examResult.id
    );


  if (!alreadySaved) {

    history.unshift({

      id: examResult.id,

      material: examResult.material,

      score: examResult.score,

      date: examResult.date

    });


    localStorage.setItem(
      "quizgenHistory",
      JSON.stringify(history)
    );
  }


  /*
  BACKEND LATER:

  GET /exams/{examId}/result

  AI-generated explanations and
  references will come from FastAPI.
  */

}