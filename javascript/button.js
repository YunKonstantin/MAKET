document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".show-more-btn");
  const arrow = document.querySelector(".show-more-img");
  const slide7 = document.querySelector(".slides .slide:nth-child(7)");
  const slide8 = document.querySelector(".slides .slide:nth-child(8)");

  if (slide7 && slide8) {
    slide7.style.display = "none";
    slide8.style.display = "none";
  }

  let isExpanded = false;

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
});
