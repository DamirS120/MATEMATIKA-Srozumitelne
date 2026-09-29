document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("hero-carousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const nextBtn = carousel.querySelector(".next");
  const scrollThumb = carousel.parentElement.querySelector(".carousel-scroll-thumb");
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

  // Ukazatel pod kartami na mobilu - poloha a šířka pásku napovídá, kolik
  // obsahu je vidět a kde ve scrollu jsme, aby bylo hned jasné, že jde
  // odscrollovat prstem dál.
  function updateScrollIndicator() {
    if (!scrollThumb) return;
    const scrollWidth = carousel.scrollWidth || 1;
    const clientWidth = carousel.clientWidth || 1;
    const maxScroll = scrollWidth - clientWidth;
    const thumbPct = Math.min(100, (clientWidth / scrollWidth) * 100);
    const scrollPct = maxScroll > 0 ? carousel.scrollLeft / maxScroll : 0;
    scrollThumb.style.width = thumbPct + "%";
    scrollThumb.style.left = scrollPct * (100 - thumbPct) + "%";
  }

  let scrollRaf = null;
  function handleScroll() {
    if (!mq.matches) return;
    if (scrollRaf) return;
    scrollRaf = window.requestAnimationFrame(function () {
      const width = carousel.clientWidth || 1;
      const index = Math.round(carousel.scrollLeft / width);
      current = Math.max(0, Math.min(slides.length - 1, index));
      updateScrollIndicator();
      scrollRaf = null;
    });
  }

  function enterMobileMode() {
    stopAutoplay();
    scrollToCurrent();
    updateScrollIndicator();
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
  window.addEventListener("resize", function () {
    if (mq.matches) updateScrollIndicator();
  });

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

// Full-width karusel pod hero (větev "new-section") - klasický fade mezi
// snímky, šipky po stranách a tečky dole, nezávislé na karuselu výše.
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("hero-carousel-full");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const wrap = carousel.closest(".hero-carousel-full-wrap") || carousel.parentElement;
  const prevBtn = wrap.querySelector(".carousel-arrow.prev");
  const nextBtn = wrap.querySelector(".carousel-arrow.next");
  const dotsWrap = wrap.parentElement.querySelector(".carousel-dots");
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".dot")) : [];

  let current = slides.findIndex(function (s) { return s.classList.contains("active"); });
  if (current < 0) current = 0;
  let timer = null;

  function sync(index) {
    slides.forEach(function (s, i) { s.classList.toggle("active", i === index); });
    dots.forEach(function (d, i) { d.classList.toggle("active", i === index); });
  }

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    sync(current);
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

  sync(current);
  startAutoplay();
});
