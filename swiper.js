const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const pagination = document.querySelector(".swiper__pagination");

let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let visibleSlides = 1; // сколько слайдов видно

// Создаем точки пагинации
function createPagination() {
  pagination.innerHTML = ""; // очищаем
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

// Обновляем слайдер
function updateSlider() {
  if (visibleSlides === slides.length) {
    // Отключаем трансформацию, показываем все слайды
    slidesContainer.style.transform = `none`;
    pagination.style.display = "none"; // скрываем точки
    return;
  }

  const slideWidth = slides[0].offsetWidth + 16; // ширина + gap
  const offset = slideWidth * currentIndex;
  slidesContainer.style.transition = "transform 0.3s ease";
  slidesContainer.style.transform = `translateX(-${offset}px)`;
  pagination.style.display = "flex";

  document.querySelectorAll(".custom-bullet").forEach((b, i) => {
    b.classList.toggle("custom-bullet--active", i === currentIndex);
  });
}

// Автопрокрутка
let autoplayInterval = setInterval(() => {
  if (visibleSlides === slides.length) return; // если слайдер выключен — не крутим
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

// Обработчики свайпа
slidesContainer.addEventListener("touchstart", (e) => {
  if (visibleSlides === slides.length) return; // отключаем свайп если слайдер выключен
  startX = e.touches[0].clientX;
  isDragging = true;
  slidesContainer.style.transition = "none";
});

slidesContainer.addEventListener("touchmove", (e) => {
  if (!isDragging || visibleSlides === slides.length) return;
  currentX = e.touches[0].clientX;
  const deltaX = currentX - startX;
  const slideWidth = slides[0].offsetWidth + 16;
  const offset = -currentIndex * slideWidth + deltaX;
  slidesContainer.style.transform = `translateX(${offset}px)`;
});

slidesContainer.addEventListener("touchend", (e) => {
  if (!isDragging || visibleSlides === slides.length) return;
  isDragging = false;
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - startX;
  const slideWidth = slides[0].offsetWidth + 16;

  slidesContainer.style.transition = "transform 0.3s ease";

  if (deltaX > slideWidth / 3 && currentIndex > 0) {
    currentIndex--;
  } else if (deltaX < -slideWidth / 3 && currentIndex < slides.length - visibleSlides) {
    currentIndex++;
  }
  updateSlider();
  resetAutoplay();
});

// Функция адаптации видимых слайдов и включения/отключения слайдера
function handleResize() {
  const width = window.innerWidth;

  if (width >= 768) {
    // Отключаем слайдер — показываем все слайды
    visibleSlides = slides.length;
    currentIndex = 0;
  } else if (width >= 480) {
    visibleSlides = 2;
  } else {
    visibleSlides = 1;
  }

  // Корректируем currentIndex если он выходит за пределы
  if (currentIndex > slides.length - visibleSlides) {
    currentIndex = slides.length - visibleSlides;
  }
  createPagination();
  updateSlider();
  resetAutoplay();
}

window.addEventListener("resize", handleResize);
handleResize(); // запускаем адаптацию сразу при загрузке
