document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("kontakt-modal");
  if (!modal) return;

  const closeBtn = modal.querySelector(".kontakt-modal-close");

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add("is-open");
    document.body.classList.add("kontakt-modal-open");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("kontakt-modal-open");
  }

  document.querySelectorAll('a[href="#kontakt"]').forEach(function (link) {
    link.addEventListener("click", openModal);
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
});
