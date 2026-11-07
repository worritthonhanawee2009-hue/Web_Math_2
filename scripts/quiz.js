document.querySelectorAll("form.questions").forEach((form) => {
  const questions = [...form.querySelectorAll("fieldset.question")];
  const answerKey = document.querySelector(".answer-key");
  const result = answerKey?.querySelector(".quiz-result");
  const answerList = answerKey?.querySelector("ol");
  const submitButton = form.querySelector(".quiz-submit");
  const quizId = form.dataset.quizId;

  if (!answerKey || !result || !answerList || !submitButton || !quizId) {
    throw new Error("The quiz is missing its result panel or quiz identifier.");
  }

  const answerItems = [...answerList.querySelectorAll("li")];
  if (answerItems.length !== questions.length) {
    throw new Error("The number of answer explanations must match the number of questions.");
  }

  questions.forEach((question) => {
    const options = [...question.querySelectorAll('input[type="radio"]')];
    const correctIndex = Number(question.dataset.answer);
    if (!options.length || !Number.isInteger(correctIndex) || !options[correctIndex]) {
      throw new Error("A quiz question has an invalid answer definition.");
    }
    options[0].required = true;
  });

  const answerDetails = answerItems.map((item) => {
    const correctLetter = item.querySelector("strong")?.textContent.trim();
    if (!correctLetter) {
      throw new Error("Each answer explanation must start with the correct option letter.");
    }

    return {
      correctLetter,
      explanation: item.textContent.replace(/^\s*[A-D]\s*[—–-]\s*/, "").trim(),
    };
  });

  let resetButton;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const correctAnswers = questions.reduce((score, question, index) => {
      const options = [...question.querySelectorAll('input[type="radio"]')];
      const selectedIndex = options.indexOf(question.querySelector(":checked"));
      const correctIndex = Number(question.dataset.answer);
      const isCorrect = selectedIndex === correctIndex;
      const correctOption = options[correctIndex];
      const feedback = document.createElement("div");
      const status = document.createElement("strong");
      const details = document.createElement("p");

      feedback.className = `question-feedback ${isCorrect ? "is-correct" : "is-incorrect"}`;
      feedback.setAttribute("role", "status");
      status.className = "question-feedback-status";
      status.textContent = isCorrect
        ? "✓ ตอบถูก"
        : `✗ ตอบไม่ถูก — คำตอบที่ถูกคือ ${answerDetails[index].correctLetter}`;
      details.textContent = answerDetails[index].explanation;
      feedback.append(status, details);

      question.querySelector(".choices").after(feedback);
      correctOption.closest(".choice").classList.add("is-correct");
      if (!isCorrect) options[selectedIndex].closest(".choice").classList.add("is-incorrect");

      return score + Number(isCorrect);
    }, 0);

    window.mathApp.saveQuizResult(quizId, correctAnswers, questions.length);
    window.mathApp.playFeedbackSound(correctAnswers === questions.length);
    result.textContent = `คุณตอบถูก ${correctAnswers} จาก ${questions.length} ข้อ`;
    answerKey.querySelector("summary").textContent = "สรุปผลการทำแบบฝึกหัด";
    answerKey.hidden = false;
    answerKey.open = true;
    submitButton.disabled = true;

    resetButton = document.createElement("button");
    resetButton.className = "quiz-submit";
    resetButton.type = "button";
    resetButton.textContent = "ทำแบบฝึกหัดชุดนี้อีกครั้ง";
    resetButton.addEventListener("click", () => {
      form.reset();
      questions.forEach((question) => {
        question.querySelectorAll(".question-feedback").forEach((feedback) => feedback.remove());
        question.querySelectorAll(".choice").forEach((choice) => {
          choice.classList.remove("is-correct", "is-incorrect");
        });
      });
      result.textContent = "";
      answerKey.querySelector("summary").textContent = "เฉลยและทบทวนคำตอบ";
      answerKey.hidden = true;
      answerKey.open = false;
      submitButton.disabled = false;
      resetButton.remove();
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    answerKey.append(resetButton);
  });
});
