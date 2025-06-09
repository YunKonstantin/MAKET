const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const pagination = document.querySelector(".swiper__pagination");

let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let visibleSlides = 1;

function createPagination() {
  pagination.innerHTML = "";
  for (let i = 0; i <= slides.length - visibleSlides; i++) {
    const bullet = document.createElement("span");
    bullet.classList.add("custom-bullet");
    if (i === currentIndex) bullet.classList.add("custom-bullet--active");
    bullet.addEventListener("click", () => {
      currentIndex = i;
      updateSlider();
      resetAutoplay();
    });
    pagination.appendChild(bullet);
  }
}

function updateSlider() {
  if (visibleSlides === slides.length) {
    slidesContainer.style.transform = `none`;
    pagination.style.display = "none";
    return;
  }

  const slideWidth = slides[0].offsetWidth + 16;
  const offset = slideWidth * currentIndex;
  slidesContainer.style.transition = "transform 0.3s ease";
  slidesContainer.style.transform = `translateX(-${offset}px)`;
  pagination.style.display = "flex";

  document.querySelectorAll(".custom-bullet").forEach((b, i) => {
    b.classList.toggle("custom-bullet--active", i === currentIndex);
  });
}

let autoplayInterval = setInterval(() => {
  if (visibleSlides === slides.length) return;
  currentIndex = (currentIndex + 1) % (slides.length - visibleSlides + 1);
  updateSlider();
}, 3000);

function resetAutoplay() {
  clearInterval(autoplayInterval);
  autoplayInterval = setInterval(() => {
    if (visibleSlides === slides.length) return;
    currentIndex = (currentIndex + 1) % (slides.length - visibleSlides + 1);
    updateSlider();
  }, 3000);
}

slidesContainer.addEventListener("touchstart", (e) => {
  if (visibleSlides === slides.length) return;
  startX = e.touches[0].clientX;
  isDragging = true;
  slidesContainer.style.transition = "none";
});

slidesContainer.addEventListener("touchmove", (e) => {
  if (!isDragging || visibleSlides === slides.length) return;
  currentX = e.touches[0].clientX;
  const deltaX = currentX - startX;
  const slideWidth = slides[0].offsetWidth + 16;
