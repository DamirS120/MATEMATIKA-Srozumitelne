document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("hero-carousel");
  if (!carousel) return;

  const slides = carousel.querySelectorAll(".carousel-slide");
  const dots = carousel.querySelectorAll(".dot");
  const isMobile = window.matchMedia("(max-width: 1024px)").matches;
  let current = 0;
  let timer;

  // Na mobilu se karusel posouvá přejetím prstem (scroll-snap), takže
  // místo přepínání .active třídy jen sledujeme, na kterém snímku uživatel je.
  if (isMobile) {
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        slides[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
    });

    let scrollRaf = null;
    carousel.addEventListener("scroll", function () {
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(function () {
        const index = Math.round(carousel.scrollLeft / carousel.clientWidth);
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
        scrollRaf = null;
      });
    });
    return;
  }

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
