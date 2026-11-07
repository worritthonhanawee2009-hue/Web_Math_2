(() => {
  const storageKey = "math-app-state";
  const defaultState = () => ({ profile: null, students: {} });

  function getStudentKey(profile) {
    if (!profile) return "guest";
    return JSON.stringify([
      profile.firstName.trim().toLocaleLowerCase(),
      profile.lastName.trim().toLocaleLowerCase(),
      profile.classroom,
    ]);
  }

  function getStudentData(state) {
    const key = getStudentKey(state.profile);
    let student = state.students[key];
    if (!student || typeof student !== "object" || Array.isArray(student)) {
      student = { quizzes: {}, lessonCompleted: false };
      state.students[key] = student;
    }
    if (!student.quizzes || typeof student.quizzes !== "object" || Array.isArray(student.quizzes)) {
      student.quizzes = {};
    }
    student.lessonCompleted = student.lessonCompleted === true;
    return student;
  }

  function readState() {
    const savedState = localStorage.getItem(storageKey);
    if (!savedState) return defaultState();

    let state;
    try {
      state = JSON.parse(savedState);
    } catch (error) {
      console.error("Could not read saved learning progress.", error);
      return defaultState();
    }

    if (!state || typeof state !== "object" || Array.isArray(state)) return defaultState();
    const profile =
      state.profile &&
      typeof state.profile.firstName === "string" &&
      typeof state.profile.lastName === "string" &&
      typeof state.profile.classroom === "string"
        ? state.profile
        : null;
    const students =
      state.students && typeof state.students === "object" && !Array.isArray(state.students)
        ? state.students
        : {};

    if (!state.students && state.quizzes && typeof state.quizzes === "object") {
      students[getStudentKey(profile)] = {
        quizzes: state.quizzes,
        lessonCompleted: state.lessonCompleted === true,
      };
    }

    return { profile, students };
  }

  function writeState(state) {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function getQuizResults() {
    const state = readState();
    return Object.entries(getStudentData(state).quizzes)
      .filter(
        ([, result]) =>
          result &&
          Number.isInteger(result.correct) &&
          Number.isInteger(result.total) &&
          result.correct >= 0 &&
          result.total > 0 &&
          result.correct <= result.total,
      )
      .map(([id, result]) => ({ id, ...result }));
  }

  window.mathApp = {
    getProfile() {
      return readState().profile;
    },
    saveProfile(profile) {
      const state = readState();
      state.profile = profile;
      getStudentData(state);
      writeState(state);
    },
    logout() {
      const state = readState();
      state.profile = null;
      writeState(state);
    },
    getQuizResults,
    saveQuizResult(id, correct, total) {
      if (
        !id ||
        !Number.isInteger(correct) ||
        !Number.isInteger(total) ||
        total < 1 ||
        correct < 0 ||
        correct > total
      ) {
        throw new Error("Invalid quiz result.");
      }
      const state = readState();
      getStudentData(state).quizzes[id] = {
        correct,
        total,
        completedAt: new Date().toISOString(),
      };
      writeState(state);
    },
    isLessonCompleted() {
      const state = readState();
      return getStudentData(state).lessonCompleted;
    },
    setLessonCompleted(completed) {
      const state = readState();
      getStudentData(state).lessonCompleted = Boolean(completed);
      writeState(state);
    },
    getScoreSummary() {
      const results = getQuizResults();
      const correct = results.reduce((sum, result) => sum + result.correct, 0);
      const total = results.reduce((sum, result) => sum + result.total, 0);
      return {
        completed: results.length,
        correct,
        total,
        average: total ? Math.round((correct / total) * 100) : null,
        lessonCompleted: getStudentData(readState()).lessonCompleted,
        results,
      };
    },
    playFeedbackSound(isCorrect) {
      if (
        localStorage.getItem("settings-sound-enabled") === "disabled" ||
        typeof window.AudioContext !== "function"
      ) {
        return;
      }

      const volume = Number(localStorage.getItem("settings-volume") ?? 70);
      if (!Number.isFinite(volume) || volume <= 0) return;

      const context = new window.AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(isCorrect ? 660 : 240, start);
      gain.gain.setValueAtTime((volume / 100) * 0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.onended = () => context.close();
      oscillator.start(start);
      oscillator.stop(start + 0.18);
    },
  };
})();
