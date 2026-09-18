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

  // Zapamatování ruční volby jazyka (CZ/RU), aby ji pak nepřebilo automatické přesměrování
  document.querySelectorAll(".lang-link").forEach(function (link) {
    link.addEventListener("click", function () {
      var lang = this.textContent.trim().toLowerCase().indexOf("ru") === 0 ? "ru" : "cs";
      localStorage.setItem("lang_choice", lang);
    });
  });
});