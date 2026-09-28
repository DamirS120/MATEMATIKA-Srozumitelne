document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("hero-carousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const nextBtn = carousel.querySelector(".next");
  const mq = window.matchMedia("(max-width: 1024px)");

  let current = slides.findIndex(function (s) { return s.classList.contains("active"); });
  if (current < 0) current = 0;
  let timer = null;

  function syncClasses(index) {
    slides.forEach(function (s, i) { s.classList.toggle("active", i === index); });
  }

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    syncClasses(current);
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

  // Na mobilu se karta posouvá jen přejetím prstem (scroll-snap), takže
  // po otočení displeje jen srovnáme scroll pozici s posledním snímkem.
  function scrollToCurrent() {
    carousel.scrollTo({ left: current * carousel.clientWidth, behavior: "auto" });
  }

  let scrollRaf = null;
  function handleScroll() {
    if (!mq.matches) return;
    if (scrollRaf) return;
    scrollRaf = window.requestAnimationFrame(function () {
      const width = carousel.clientWidth || 1;
      const index = Math.round(carousel.scrollLeft / width);
      current = Math.max(0, Math.min(slides.length - 1, index));
      scrollRaf = null;
    });
  }

  function enterMobileMode() {
    stopAutoplay();
    scrollToCurrent();
  }

  function enterDesktopMode() {
    syncClasses(current);
    startAutoplay();
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (mq.matches) return;
      stopAutoplay();
      showSlide(current + 1);
      startAutoplay();
    });
  }

  carousel.addEventListener("mouseenter", function () {
    if (!mq.matches) stopAutoplay();
  });
  carousel.addEventListener("mouseleave", function () {
    if (!mq.matches) startAutoplay();
  });
  carousel.addEventListener("scroll", handleScroll);

  function handleModeChange(e) {
    if (e.matches) {
      enterMobileMode();
    } else {
      enterDesktopMode();
    }
  }

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", handleModeChange);
  } else if (typeof mq.addListener === "function") {
    mq.addListener(handleModeChange);
  }

  if (mq.matches) {
    enterMobileMode();
  } else {
    enterDesktopMode();
  }
});
