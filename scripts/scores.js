const summary = window.mathApp.getScoreSummary();
const scoreValue = document.querySelector("#total-score");
const completedValue = document.querySelector("#completed-quizzes");
const lessonValue = document.querySelector("#completed-lessons");
const emptyState = document.querySelector("#empty-state");
const history = document.querySelector("#score-history");
const historyList = document.querySelector("#score-history-list");

scoreValue.textContent = summary.total ? `${summary.correct} / ${summary.total}` : "—";
completedValue.textContent = String(summary.completed);
lessonValue.textContent = summary.lessonCompleted ? "1" : "0";

if (summary.completed) {
  emptyState.hidden = true;
  history.hidden = false;
  const quizNames = {
    basic: "แบบฝึกหัดพื้นฐาน",
    intermediate: "แบบฝึกหัดระดับปานกลาง",
    advanced: "แบบฝึกหัดระดับสูง",
  };
  summary.results.forEach((result) => {
    const item = document.createElement("li");
    const name = document.createElement("strong");
    const score = document.createElement("span");
    name.textContent = quizNames[result.id] ?? "แบบฝึกหัด";
    score.textContent = `${result.correct} / ${result.total} คะแนน`;
    item.append(name, score);
    historyList.append(item);
  });
} else {
  emptyState.hidden = false;
  history.hidden = true;
}
