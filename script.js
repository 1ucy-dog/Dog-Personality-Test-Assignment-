// TODO(you): Write the JavaScript necessary to complete the homework.

// You can access the RESULTS_MAP from "constants.js" in this file since
// "constants.js" has been included before "script.js" in index.html.


"use strict";

const TOTAL_QUESTIONS = 3;
let answers = {};          // { one: "blep", two: "...", three: "..." }
let quizDone = false;

// All clickable choices
const choices = document.querySelectorAll("[data-choice-id][data-question-id]");

// Result section elements (must exist in index.html – see step 2)
const resultSection  = document.querySelector("#result");
const resultTitle    = document.querySelector("#result-title");
const resultContents = document.querySelector("#result-contents");
const restartButton  = document.querySelector("#restart-quiz");

// Attach listeners
choices.forEach(choice => {
  choice.addEventListener("click", onChoiceClick);
});

if (restartButton) {
  restartButton.addEventListener("click", restartQuiz);
}

/* --------------------  CLICK HANDLER  -------------------- */

function onChoiceClick(event) {
  // Once quiz is done, ignore any further clicks
  if (quizDone) return;

  const selected   = event.currentTarget;
  const questionId = selected.dataset.questionId;   // "one", "two", "three"
  const choiceId   = selected.dataset.choiceId;     // "blep", "happy", ...

  // Save user’s answer
  answers[questionId] = choiceId;

  // Update the UI for ONLY this question
  updateQuestionUI(questionId, selected);

  // If all 3 questions answered → finish quiz
  if (isQuizComplete()) {
    quizDone = true;
    showResult();
  }
}

/* -------------  VISUAL UPDATE FOR ONE QUESTION ------------- */

function updateQuestionUI(questionId, selectedElement) {
  const inSameQuestion = document.querySelectorAll(
    `[data-question-id="${questionId}"]`
  );

  inSameQuestion.forEach(elem => {
    const checkbox = elem.querySelector(".checkbox");

    if (elem === selectedElement) {
      // Selected choice
      elem.style.backgroundColor = "#cfe3ff";
      elem.style.opacity = "1";
      if (checkbox) checkbox.src = "images/checked.png";
    } else {
      // Unselected options in this question
      elem.style.backgroundColor = "";
      elem.style.opacity = "0.6";
      if (checkbox) checkbox.src = "images/unchecked.png";
    }
  });
}

/* -------------------  COMPLETION CHECK  ------------------- */

function isQuizComplete() {
  return answers.one && answers.two && answers.three;
}

/* ---------------------  SHOW RESULT  ---------------------- */

function showResult() {
  if (!resultSection || !resultTitle || !resultContents) {
    console.error("Result section missing from HTML");
    return;
  }

  // Get numeric ids from RESULTS_MAP (from constants.js)
  const ids = ["one", "two", "three"].map(q => {
    const choiceKey = answers[q];          // e.g. "blep"
    return RESULTS_MAP[choiceKey].id;      // numeric id
  });

  const avgId = Math.floor((ids[0] + ids[1] + ids[2]) / TOTAL_QUESTIONS);

  // Find which key in RESULTS_MAP has this id
  let resultKey = null;
  for (const key in RESULTS_MAP) {
    if (RESULTS_MAP[key].id === avgId) {
      resultKey = key;
      break;
    }
  }

  const result = RESULTS_MAP[resultKey];

  resultTitle.textContent    = result.title;
  resultContents.textContent = result.contents;

  resultSection.classList.remove("hidden");
  resultSection.style.display = "block";
  resultSection.scrollIntoView({ behavior: "smooth" });
}

/* ---------------------  RESTART QUIZ  --------------------- */

function restartQuiz() {
  quizDone = false;
  answers = {};

  // Reset each choice appearance
  choices.forEach(elem => {
    elem.style.backgroundColor = "";
    elem.style.opacity = "1";
    const checkbox = elem.querySelector(".checkbox");
    if (checkbox) checkbox.src = "images/unchecked.png";
  });

  // Hide result box & clear text
  if (resultSection) {
    resultSection.classList.add("hidden");
    resultSection.style.display = "none";
  }
  if (resultTitle)    resultTitle.textContent = "";
  if (resultContents) resultContents.textContent = "";

  // Scroll back to the first "Pick a pup" banner
  const firstBanner = document.querySelector(".question-name");
  if (firstBanner) {
    firstBanner.scrollIntoView({ behavior: "smooth" });
  }
}
