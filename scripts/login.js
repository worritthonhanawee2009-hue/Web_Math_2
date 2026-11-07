document.querySelector(".fields")?.addEventListener("submit", (event) => {
  const form = event.currentTarget;
  const formData = new FormData(form);
  window.mathApp.saveProfile({
    firstName: String(formData.get("firstName")).trim(),
    lastName: String(formData.get("lastName")).trim(),
    classroom: String(formData.get("classroom")),
  });
  window.location.href = "./home_1.html";
  event.preventDefault();
});
