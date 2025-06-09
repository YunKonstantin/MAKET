const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const pagination = document.querySelector(".swiper__pagination");

let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let visibleSlides = 1;

/**
 * Получить массив отображаемых слайдов для пагинации.
 */
function getVisibleSlidesForBullets() {
  const width = window.innerWidth;

  if (width < 768) {
    // На мобилке отображаем только первые 8 слайдов без extra
    const visibles = [];
    for (let i = 0; i < slides.length; i++) {
      if (!slides[i].classList.contains("extra")) {
        visibles.push(slides[i]);
        if (visibles.length === 8) break;
      }
    }
    return visibles;
  } else if (width < 1440) {
    // На планшете отображаем только слайды без extra (и пагинация включается)
    return Array.from(slides).filter(s => !s.classList.contains("extra"));
  } else {
    // На 1440+ считаем видимыми всё кроме скрытых вручную (например, display: none)
    return Array.from(slides).filter(
      s => s.offsetParent !== null // только реально видимые (сетка)
    );
  }
}

function createPagination() {
  pagination.innerHTML = "";
  const visibleForBullets = getVisibleSlidesForBullets();
  const bulletCount = Math.max(visibleForBullets.length - visibleSlides + 1, 1);

  // На 1440+ (или >N), если сетка — буллеты можно не показывать
  if (window.innerWidth >= 1440) {
    pagination.style.display = "none";
    return;
  } else {
    pagination.style.display = "flex";
  }

  for (let i = 0; i < bulletCount; i++) {
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
  const visibleForBullets = getVisibleSlidesForBullets();
  if (visibleSlides >= visibleForBullets.length || window.innerWidth >= 1440) {
    slidesContainer.style.transform = "none";
    pagination.style.display = "none";
    return;
  }

  const slideWidth = visibleForBullets[0].offsetWidth + 16;
  const offset = slideWidth * currentIndex;
  slidesContainer.style.transition = "transform 0.3s ease";
  slidesContainer.style.transform = `translateX(-${offset}px)`;
  pagination.style.display = "flex";

  document.querySelectorAll(".custom-bullet").forEach((b, i) => {
    b.classList.toggle("custom-bullet--active", i === currentIndex);
  });
}

let autoplayInterval = setInterval(() => {
  const visibleForBullets = getVisibleSlidesForBullets();
  if (visibleSlides >= visibleForBullets.length || window.innerWidth >= 1440) return;
  currentIndex = (currentIndex + 1) % (visibleForBullets.length - visibleSlides + 1);
  updateSlider();
}, 3000);

function resetAutoplay() {
  clearInterval(autoplayInterval);
  autoplayInterval = setInterval(() => {
    const visibleForBullets = getVisibleSlidesForBullets();
    if (visibleSlides >= visibleForBullets.length || window.innerWidth >= 1440) return;
    currentIndex = (currentIndex + 1) % (visibleForBullets.length - visibleSlides + 1);
    updateSlider();
  }, 3000);
}

slidesContainer.addEventListener("touchstart", (e) => {
  const visibleForBullets = getVisibleSlidesForBullets();
  if (visibleSlides >= visibleForBullets.length || window.innerWidth >= 1440) return;
  startX = e.touches[0].clientX;
  isDragging = true;
  slidesContainer.style.transition = "none";
});

slidesContainer.addEventListener("touchmove", (e) => {
  if (!isDragging || window.innerWidth >= 1440) return;
  const visibleForBullets = getVisibleSlidesForBullets();
  if (visibleSlides >= visibleForBullets.length) return;
  currentX = e.touches[0].clientX;
  const deltaX = currentX - startX;
  const slideWidth = visibleForBullets[0].offsetWidth + 16;
  const offset = -currentIndex * slideWidth + deltaX;
  slidesContainer.style.transform = `translateX(${offset}px)`;
});

slidesContainer.addEventListener("touchend", (e) => {
  if (!isDragging || window.innerWidth >= 1440) return;
  isDragging = false;
  const visibleForBullets = getVisibleSlidesForBullets();
  if (visibleSlides >= visibleForBullets.length) return;
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - startX;
  const slideWidth = visibleForBullets[0].offsetWidth + 16;

  slidesContainer.style.transition = "transform 0.3s ease";

  if (deltaX > slideWidth / 3 && currentIndex > 0) {
    currentIndex--;
  } else if (
    deltaX < -slideWidth / 3 &&
    currentIndex < visibleForBullets.length - visibleSlides
  ) {
    currentIndex++;
  }
  updateSlider();
  resetAutoplay();
});

function handleResize() {
  const width = window.innerWidth;
  if (width >= 1440) {
    visibleSlides = getVisibleSlidesForBullets().length;
    currentIndex = 0;
  } else if (width >= 768) {
    visibleSlides = getVisibleSlidesForBullets().length;
    currentIndex = 0;
  } else if (width >= 480) {
    visibleSlides = 2;
  } else {
    visibleSlides = 1;
  }
  if (currentIndex > getVisibleSlidesForBullets().length - visibleSlides) {
    currentIndex = getVisibleSlidesForBullets().length - visibleSlides;
  }
  createPagination();
  updateSlider();
  resetAutoplay();
}

window.addEventListener("resize", handleResize);
handleResize();

