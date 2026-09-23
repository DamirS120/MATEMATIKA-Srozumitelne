document.addEventListener("DOMContentLoaded", function () {
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdown = document.querySelector(".dropdown");

  // Funkce pro přepínání menu (funguje na všech šířkách - dropdown se vždy ovládá klikem/tapem, ne hoverem)
  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener("click", function (e) {
      e.preventDefault(); // Zabrání okamžitému odchodu na stránku
      e.stopPropagation(); // Zabrání, aby klik "probublal" na document a hned menu zase zavřel
      dropdown.classList.toggle("show");
    });
  }

  // Zavření menu při kliknutí kamkoliv mimo něj
  document.addEventListener("click", function (e) {
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });

  // Carousel "Vyber si své přijímačky" na indexu - šipky/tečky posouvají o jednu kartu
  document.querySelectorAll(".prijimacky-carousel").forEach(function (carousel) {
    var track = carousel.querySelector(".prijimacky-track");
    var prevBtn = carousel.querySelector(".carousel-prev");
    var nextBtn = carousel.querySelector(".carousel-next");
    var dots = carousel.querySelectorAll(".carousel-dots .dot");
    if (!track || !prevBtn || !nextBtn) return;

    function step() {
      var card = track.querySelector(".card");
      var gap = parseFloat(getComputedStyle(track).columnGap) || 20;
      return card ? card.getBoundingClientRect().width + gap : 280;
    }

    function updateDots() {
      if (!dots.length) return;
      var index = Math.round(track.scrollLeft / step());
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function atStart() {
      return track.scrollLeft <= step() / 2;
    }
    function atEnd() {
      return track.scrollLeft >= track.scrollWidth - track.clientWidth - step() / 2;
    }

    prevBtn.addEventListener("click", function () {
      if (atStart()) {
        track.scrollTo({ left: track.scrollWidth - track.clientWidth, behavior: "smooth" });
      } else {
        track.scrollBy({ left: -step(), behavior: "smooth" });
      }
    });
    nextBtn.addEventListener("click", function () {
      if (atEnd()) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: step(), behavior: "smooth" });
      }
    });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        track.scrollTo({ left: i * step(), behavior: "smooth" });
      });
    });

    var dotsRaf = null;
    track.addEventListener("scroll", function () {
      if (dotsRaf) return;
      dotsRaf = window.requestAnimationFrame(function () {
        updateDots();
        dotsRaf = null;
      });
    });
  });

  // Zapamatování ruční volby jazyka (CZ/RU), aby ji pak nepřebilo automatické přesměrování
  document.querySelectorAll(".lang-link").forEach(function (link) {
    link.addEventListener("click", function () {
      var lang = this.textContent.trim().toLowerCase().indexOf("ru") === 0 ? "ru" : "cs";
      localStorage.setItem("lang_choice", lang);
    });
  });

  // Volba "osobně / online" v hero (mode-picker) se promítne do výběru
  // formy výuky v anketě dole na stránce, ať se v ní odráží, co si zákazník vybral.
  var modeRadios = document.querySelectorAll('input[name="vyuka-forma"]');
  var formaVyuky = document.getElementById("forma_vyuky");
  if (modeRadios.length && formaVyuky) {
    modeRadios.forEach(function (radio) {
      if (radio.checked) {
        formaVyuky.value = radio.value;
      }
      radio.addEventListener("change", function () {
        formaVyuky.value = this.value;
      });
    });
  }
});