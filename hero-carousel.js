document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("hero-carousel");
  if (!carousel) return;

  const slides = carousel.querySelectorAll(".carousel-slide");
  const dots = carousel.querySelectorAll(".dot");
  let current = 0;
  let timer;

  function showSlide(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function startAutoplay() {
    timer = setInterval(function () {
      showSlide(current + 1);
    }, 6000);
  }

  function stopAutoplay() {
    clearInterval(timer);
  }

  carousel.querySelector(".prev").addEventListener("click", function () {
    stopAutoplay();
    showSlide(current - 1);
    startAutoplay();
  });

  carousel.querySelector(".next").addEventListener("click", function () {
    stopAutoplay();
    showSlide(current + 1);
    startAutoplay();
  });

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
