const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const pagination = document.querySelector(".swiper__pagination");

let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;


slides.forEach((_, index) => {
  const bullet = document.createElement("span");
  bullet.classList.add("custom-bullet");
  if (index === 0) bullet.classList.add("custom-bullet--active");
  bullet.addEventListener("click", () => {
    currentIndex = index;
    updateSlider();
    resetAutoplay();
  });
  pagination.appendChild(bullet);
});

function updateSlider() {
  const slideWidth = slides[0].offsetWidth + 16; 
  const offset = slideWidth * currentIndex;
  slidesContainer.style.transition = "transform 0.3s ease";
  slidesContainer.style.transform = `translateX(-${offset}px)`;

  document.querySelectorAll(".custom-bullet").forEach((b, i) => {
    b.classList.toggle("custom-bullet--active", i === currentIndex);
  });
}

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
  slidesContainer.style.transition = "none";
});

slidesContainer.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX;
  const deltaX = currentX - startX;
  const slideWidth = slides[0].offsetWidth + 16;
  const offset = -currentIndex * slideWidth + deltaX;
  slidesContainer.style.transform = `translateX(${offset}px)`; 
});

slidesContainer.addEventListener("touchend", (e) => {
  if (!isDragging) return;
  isDragging = false;
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - startX;
  const slideWidth = slides[0].offsetWidth + 16;

  slidesContainer.style.transition = "transform 0.3s ease"; 

  if (deltaX > slideWidth / 3 && currentIndex > 0) {
    currentIndex--;
  } else if (deltaX < -slideWidth / 3 && currentIndex < slides.length - 1) {
    currentIndex++;
  }
  updateSlider();
  resetAutoplay();
});
