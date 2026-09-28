document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("hero-carousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");
  const dots = Array.from(carousel.querySelectorAll(".dot"));

  let current = slides.findIndex(function (s) { return s.classList.contains("active"); });
  if (current < 0) current = 0;
  let timer = null;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle("active", i === current); });
    dots.forEach(function (d, i) { d.classList.toggle("active", i === current); });
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(function () {
      showSlide(current + 1);
    }, 6000);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      stopAutoplay();
      showSlide(current - 1);
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      stopAutoplay();
      showSlide(current + 1);
      startAutoplay();
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      stopAutoplay();
      showSlide(i);
      startAutoplay();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
});
