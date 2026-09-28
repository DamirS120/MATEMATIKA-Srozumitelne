document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("hero-carousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const dotsScope = carousel.closest(".hero-carousel-wrap") || carousel;
  const dots = Array.from(dotsScope.querySelectorAll(".dot"));
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");
  const mq = window.matchMedia("(max-width: 1024px)");

  let current = slides.findIndex(function (s) { return s.classList.contains("active"); });
  if (current < 0) current = 0;
  let timer = null;

  function syncClasses(index) {
    slides.forEach(function (s, i) { s.classList.toggle("active", i === index); });
    dots.forEach(function (d, i) { d.classList.toggle("active", i === index); });
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

  // Na mobilu se karusel posouvá přejetím prstem (scroll-snap). Tady jen
  // srovnáme scroll pozici s tím, na kterém snímku jsme byli naposledy
  // (např. po otočení displeje z landscape na portrait).
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
      dots.forEach(function (d, i) { d.classList.toggle("active", i === current); });
      slides.forEach(function (s, i) { s.classList.toggle("active", i === current); });
      scrollRaf = null;
    });
  }

  // Přepínání mezi mobilním (scroll-snap) a desktopovým (šipky + autoplay)
  // režimem se dřív řešilo jen jednou při načtení stránky, takže po otočení
  // displeje nebo resize okna přes hranici breakpointu zůstaly viset staré
  // posluchače/timer z původního režimu a karusel přestal odpovídat aktuální
  // pozici. Teď se stav vždy přepočítá při každé změně matchMedia.
  function enterMobileMode() {
    stopAutoplay();
    syncClasses(current);
    scrollToCurrent();
  }

  function enterDesktopMode() {
    syncClasses(current);
    startAutoplay();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      if (mq.matches) return;
      stopAutoplay();
      showSlide(current - 1);
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (mq.matches) return;
      stopAutoplay();
      showSlide(current + 1);
      startAutoplay();
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      if (mq.matches) {
        slides[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      } else {
        stopAutoplay();
        showSlide(i);
        startAutoplay();
      }
    });
  });

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
