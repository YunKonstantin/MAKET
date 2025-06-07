const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const pagination = document.querySelector(".swiper__pagination");

let currentIndex = 0;

slides.forEach((_, index) => {
  const bullet = document.createElement("span");
  bullet.classList.add("custom-bullet");
  if (index === 0) bullet.classList.add("custom-bullet--active");
  bullet.addEventListener("click", () => {
    currentIndex = index;
    updateSlider();
  });
  pagination.appendChild(bullet);
});

function updateSlider() {
  const offset = slides[currentIndex].offsetLeft;
  slidesContainer.style.transform = `translateX(-${offset}px)`;

  document.querySelectorAll(".custom-bullet").forEach((b, i) => {
    b.classList.toggle("custom-bullet--active", i === currentIndex);
  });
}
let startX = 0;
let isDragging = false;

let autoplayInterval = setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
}, 3000);

function resetAutoplay() {
  clearInterval(autoplayInterval);
  autoplayInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }, 3000);
}

slidesContainer.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

slidesContainer.addEventListener("touchend", (e) => {
  if (!isDragging) return;
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - startX;

  if (deltaX > 50 && currentIndex > 0) {
    currentIndex--;
    updateSlider();
    resetAutoplay();
  } else if (deltaX < -50 && currentIndex < slides.length - 1) {
    currentIndex++;
    updateSlider();
    resetAutoplay();
  }

  isDragging = false;
});
