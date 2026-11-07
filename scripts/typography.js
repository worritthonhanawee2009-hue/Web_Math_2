(() => {
  const storageKey = "settings-font-size";
  const baseFontSize = 16;
  const savedSize = Number(localStorage.getItem(storageKey));
  const initialSize =
    Number.isFinite(savedSize) && savedSize >= 12 && savedSize <= 24
      ? savedSize
      : baseFontSize;
  const textElements = [...document.body.querySelectorAll("*")]
    .filter((element) =>
      [...element.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
      ),
    )
    .map((element) => ({
      element,
      fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
    }));

  function setSize(size) {
    const scale = size / baseFontSize;
    textElements.forEach(({ element, fontSize }) => {
      element.style.fontSize = `${fontSize * scale}px`;
    });
  }

  window.mathTypography = { setSize };
  setSize(initialSize);
})();
