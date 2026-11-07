const completionButton = document.querySelector("#lesson-complete");

function updateCompletionButton() {
  const completed = window.mathApp.isLessonCompleted();
  completionButton.textContent = completed ? "✓ บทเรียนนี้เรียนจบแล้ว" : "ทำเครื่องหมายว่าเรียนจบ";
  completionButton.setAttribute("aria-pressed", String(completed));
}

completionButton?.addEventListener("click", () => {
  window.mathApp.setLessonCompleted(!window.mathApp.isLessonCompleted());
  updateCompletionButton();
});

if (completionButton) updateCompletionButton();
