document.addEventListener("DOMContentLoaded", function () {
  function visibleChildren(el) {
    return Array.prototype.filter.call(el.children, function (child) {
      if (child.tagName === "SCRIPT" || child.tagName === "NOSCRIPT") return false;
      return child.offsetHeight > 40;
    });
  }

  // Na podstránkách je obsah zabalený v jednom <main>, na homepage jsou
  // sekce přímo v <body>. Tady <main> "rozbalíme", aby se šipkami dalo
  // procházet po jednotlivých sekcích uvnitř, ne po celém <main> najednou.
  var sections = [];
  visibleChildren(document.body).forEach(function (el) {
    if (el.tagName === "MAIN") {
      sections = sections.concat(visibleChildren(el));
    } else {
      sections.push(el);
    }
  });

  if (sections.length < 2) return;

  function isTypingTarget(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
  }

  function currentIndex() {
    var y = window.scrollY + window.innerHeight * 0.3;
    var idx = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= y) idx = i;
    }
    return idx;
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (isTypingTarget(document.activeElement)) return;

    var next = currentIndex() + (e.key === "ArrowDown" ? 1 : -1);
    if (next < 0 || next >= sections.length) return;

    e.preventDefault();
    sections[next].scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
