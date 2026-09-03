if (!requireAuth()) throw new Error("Authentication required");

const examResult = readStoredJson("examResult", sessionStorage) || readStoredJson(RESULT_STORAGE_KEY);
const resultContainer = document.getElementById("resultContainer");

if (!examResult) {
  resultContainer.innerHTML = `<div class="review-card"><p>No exam result found.</p></div>`;
} else {
  document.getElementById("resultMaterial").textContent = examResult.material;
  document.getElementById("score").textContent = `${examResult.score}%`;
  document.getElementById("correctCount").textContent = examResult.correct_count;
  document.getElementById("totalQuestions").textContent = examResult.total_questions;

  examResult.results.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = `review-card ${item.correct ? "correct" : "incorrect"}`;

    const top = document.createElement("div");
    top.className = "review-top";
    const number = document.createElement("strong");
    number.textContent = `Question ${index + 1}`;
    const status = document.createElement("span");
    status.className = "review-status";
    status.textContent = `${item.awarded_marks}/${item.max_marks} mark${item.max_marks === 1 ? "" : "s"}`;
    top.append(number, status);

    const title = document.createElement("h3");
    title.textContent = item.question;
    card.append(top, title);
    card.appendChild(answerBlock("Your Answer", item.user_answer || "Not answered"));
    card.appendChild(answerBlock("Correct Answer", item.correct_answer));

    if (item.type === "short") {
      card.appendChild(answerBlock(
        "Evaluation",
        `${item.feedback} Factual: ${Math.round(item.factual_score * 100)}%, semantic: ${Math.round(item.semantic_score * 100)}%.`
      ));
    }

    const explanation = document.createElement("div");
    explanation.className = "explanation-box";
    const explanationTitle = document.createElement("strong");
    explanationTitle.textContent = "Explanation";
    const explanationText = document.createElement("p");
    explanationText.textContent = item.explanation;
    explanation.append(explanationTitle, explanationText);

    const source = document.createElement("div");
    source.className = "source-reference";
    source.textContent = `Source: ${item.source}`;
    card.append(explanation, source);
    resultContainer.appendChild(card);
  });
}

function answerBlock(label, value) {
  const block = document.createElement("div");
  block.className = "answer-block";
  const heading = document.createElement("span");
  heading.textContent = label;
  const text = document.createElement("p");
  text.textContent = value;
  block.append(heading, text);
  return block;
}
