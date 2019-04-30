var modal = document.querySelector(".modal");
    modalButtons = document.querySelectorAll(".modal-open");

var revealModal = function (button) {
  button.addEventListener("click", function(evt) {
    evt.preventDefault();
    modal.classList.add("modal_show");
  })
}

for(var i = 0; i < modalButtons.length; i++) {
  revealModal(modalButtons[i]);
}

window.addEventListener("keydown", function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    if (modal.classList.contains("modal_show")) {
      modal.classList.remove("modal_show");
    }
  }
});
