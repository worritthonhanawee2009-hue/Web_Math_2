const fontSizeInput = document.querySelector('input[type="range"][aria-label="ขนาดตัวอักษร"]');
const fontSizeOutput = fontSizeInput.closest(".range").querySelector("output");
const soundToggle = document.querySelector('input[type="checkbox"][aria-label="เปิดเสียง"]');
const volumeInput = document.querySelector('input[type="range"][aria-label="ระดับเสียง"]');
const volumeOutput = volumeInput.closest(".range").querySelector("output");

function readStoredNumber(key, input) {
  const storedValue = localStorage.getItem(key);
  if (storedValue === null) return Number(input.value);

  const savedValue = Number(storedValue);
  return Number.isFinite(savedValue) &&
    savedValue >= Number(input.min) &&
    savedValue <= Number(input.max)
    ? savedValue
    : Number(input.value);
}

function updateFontSize() {
  const size = Number(fontSizeInput.value);
  fontSizeOutput.textContent = `${size}px`;
  window.mathTypography.setSize(size);
  localStorage.setItem("settings-font-size", String(size));
}

fontSizeInput.value = String(readStoredNumber("settings-font-size", fontSizeInput));
fontSizeInput.addEventListener("input", updateFontSize);
updateFontSize();

volumeInput.value = String(readStoredNumber("settings-volume", volumeInput));
soundToggle.checked = localStorage.getItem("settings-sound-enabled") !== "disabled";

function updateAudioSettings() {
  const enabled = soundToggle.checked;
  const volume = Number(volumeInput.value);
  localStorage.setItem("settings-sound-enabled", enabled ? "enabled" : "disabled");
  localStorage.setItem("settings-volume", String(volume));
  volumeOutput.textContent = `${volume}%`;
  window.mathAudioSettings = { enabled, volume };
}

soundToggle.addEventListener("change", updateAudioSettings);
volumeInput.addEventListener("input", updateAudioSettings);
updateAudioSettings();
