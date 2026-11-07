const darkModeKey = "settings-dark-mode";
const darkModeToggle = document.querySelector("#dark-mode");

function applyDarkMode(enabled) {
  document.body.classList.toggle("dark-mode", enabled);
  if (darkModeToggle) {
    darkModeToggle.checked = enabled;
  }
}

applyDarkMode(localStorage.getItem(darkModeKey) === "enabled");

darkModeToggle?.addEventListener("change", () => {
  const enabled = darkModeToggle.checked;
  localStorage.setItem(darkModeKey, enabled ? "enabled" : "disabled");
  applyDarkMode(enabled);
});

window.addEventListener("storage", (event) => {
  if (event.key === darkModeKey) {
    applyDarkMode(event.newValue === "enabled");
  }
});
