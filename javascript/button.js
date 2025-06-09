document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".show-more-btn");
  const arrow = document.querySelector(".show-more-img");
  const slide7 = document.querySelector(".slides .slide:nth-child(7)");
  const slide8 = document.querySelector(".slides .slide:nth-child(8)");

  let isExpanded = false;

  function updateSlidesVisibility() {
    const width = window.innerWidth;

    if (width < 768) {
      if (slide7 && slide8) {
        slide7.style.display = "flex";
        slide8.style.display = "flex";
      }
      if (button) button.style.display = "none";
      if (arrow) arrow.classList.remove("rotate");
      isExpanded = false;
    } else {
      if (slide7 && slide8) {
        slide7.style.display = isExpanded ? "flex" : "none";
        slide8.style.display = isExpanded ? "flex" : "none";
      }
      if (button) button.style.display = "inline-flex";
      if (button) button.textContent = isExpanded ? "Скрыть" : "Показать все";
      if (arrow) arrow.classList.toggle("rotate", isExpanded);
    }
  }

  if (button) {
    button.addEventListener("click", () => {
      isExpanded = !isExpanded;

      if (slide7 && slide8) {
        slide7.style.display = isExpanded ? "flex" : "none";
        slide8.style.display = isExpanded ? "flex" : "none";
      }

      button.textContent = isExpanded ? "Скрыть" : "Показать все";

      if (arrow) {
        arrow.classList.toggle("rotate", isExpanded);
      }
    });
  }

  window.addEventListener("resize", updateSlidesVisibility);

  updateSlidesVisibility();
});
