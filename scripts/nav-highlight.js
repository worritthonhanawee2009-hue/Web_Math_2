document.querySelectorAll(".main-nav").forEach((nav) => {
  const links = [...nav.querySelectorAll("a")];
  if (!links.length) return;

  const highlight = document.createElement("span");
  highlight.className = "nav-highlight";
  highlight.setAttribute("aria-hidden", "true");
  nav.prepend(highlight);

  let highlightedLink = null;

  function moveHighlight(link) {
    if (!link) {
      highlight.style.opacity = "0";
      if (highlightedLink) {
        highlightedLink.removeAttribute("data-highlighted");
        highlightedLink = null;
      }
      return;
    }

    if (highlightedLink !== link) {
      highlightedLink?.removeAttribute("data-highlighted");
      highlightedLink = link;
      link.setAttribute("data-highlighted", "true");
    }

    highlight.style.width = `${link.offsetWidth}px`;
    highlight.style.height = `${link.offsetHeight}px`;
    highlight.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
    highlight.style.opacity = "1";
  }

  function restoreCurrentLink() {
    moveHighlight(nav.querySelector('a[aria-current="page"]'));
  }

  nav.addEventListener("pointerover", (event) => {
    const link = event.target.closest("a");
    if (link && nav.contains(link)) moveHighlight(link);
  });
  nav.addEventListener("pointerleave", restoreCurrentLink);
  nav.addEventListener("focusin", (event) => {
    const link = event.target.closest("a");
    if (link && nav.contains(link)) moveHighlight(link);
  });
  nav.addEventListener("focusout", (event) => {
    if (!nav.contains(event.relatedTarget)) restoreCurrentLink();
  });
  window.addEventListener("resize", restoreCurrentLink);
  restoreCurrentLink();
});
