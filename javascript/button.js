document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".show-more-btn");
  const arrow = document.querySelector(".show-more-img");
  const slides = document.querySelectorAll(".slides .slide");
  const slide7 = document.querySelector(".slides .slide:nth-child(7)");
  const slide8 = document.querySelector(".slides .slide:nth-child(8)");
  const extraSlides = document.querySelectorAll(".slides .slide.extra");
  let isExpanded = false;

  function getMode() {
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width < 1440) return "tablet";
    return "desktop";
  }

  function updateSlidesVisibility() {
    const mode = getMode();

    if (mode === "mobile") {
      if (slide7) slide7.style.display = "flex";
      if (slide8) slide8.style.display = "flex";
      extraSlides.forEach((s) => (s.style.display = "none"));
      if (button) button.style.display = "none";
      if (arrow) arrow.classList.remove("rotate");
      isExpanded = false;
    } else if (mode === "tablet") {
      slides.forEach((slide, idx) => {
        if (idx < 6) slide.style.display = "flex";
      });
      if (slide7) slide7.style.display = isExpanded ? "flex" : "none";
      if (slide8) slide8.style.display = isExpanded ? "flex" : "none";
      extraSlides.forEach((s) => (s.style.display = "none"));
      if (button) {
        button.style.display = "inline-flex";
        button.textContent = isExpanded ? "Скрыть" : "Показать все";
      }
      if (arrow) arrow.classList.toggle("rotate", isExpanded);
    } else {
      slides.forEach((slide, idx) => {
        if (!slide.classList.contains("extra")) slide.style.display = "flex";
      });
      extraSlides.forEach(
        (s) => (s.style.display = isExpanded ? "flex" : "none")
      );
      if (button) {
        button.style.display = "inline-flex";
        button.textContent = isExpanded ? "Скрыть" : "Показать все";
      }
      if (arrow) arrow.classList.toggle("rotate", isExpanded);
    }
  }

  if (button) {
    button.addEventListener("click", () => {
      isExpanded = !isExpanded;
      updateSlidesVisibility();
    });
  }

  window.addEventListener("resize", updateSlidesVisibility);
  updateSlidesVisibility();
});
