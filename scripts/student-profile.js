const params = new URLSearchParams(window.location.search);
const firstName = params.get("firstName")?.trim();
const lastName = params.get("lastName")?.trim();
const classroom = params.get("classroom");

if (firstName && lastName && classroom) {
  window.mathApp.saveProfile({ firstName, lastName, classroom });
  window.history.replaceState(null, "", window.location.pathname + window.location.hash);
}

const profile = window.mathApp.getProfile();
const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "ผู้เรียนตัวอย่าง";
const nameElement = document.querySelector("#student-name");
const roomElement = document.querySelector("#student-room");
if (nameElement) nameElement.textContent = fullName;
if (roomElement && profile) roomElement.textContent = `ม.4/${profile.classroom}`;

document.querySelectorAll(".profile").forEach((profileLink) => {
  const avatar = profileLink.querySelector(".avatar");
  const label = profileLink.querySelector("span:last-child");
  if (avatar) avatar.textContent = profile ? Array.from(profile.firstName)[0] : "น";
  if (label) label.textContent = profile ? fullName : "เข้าสู่ระบบ";
  if (!profile) profileLink.href = "./index.html";
});

const scoreCard = document.querySelector(".score-card");
if (scoreCard) {
  const { correct, total } = window.mathApp.getScoreSummary();
  scoreCard.querySelector("strong").textContent = total
    ? `${correct} / ${total} คะแนน`
    : "ยังไม่มีคะแนน";
}

const logoutLink = document.querySelector(".logout-button");
logoutLink?.addEventListener("click", () => window.mathApp.logout());
