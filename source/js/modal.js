var isModalWindowOpen = false;

var modalWrapper = document.querySelector('.js-modal__wrapper');
var modalWindow = modalWrapper.querySelector('.js-modal__window');
var modalOpenButtons = document.querySelectorAll('.js-modal__open'); // array
var modalCloseButtons = modalWrapper.querySelectorAll('.js-modal__close'); // array

function toggleModalWindow(value) { // boolean
    isModalWindowOpen = value;

    if (isModalWindowOpen) {
        modalWrapper.classList.remove('modal__wrapper_hidden');
    } else {
        modalWrapper.classList.add('modal__wrapper_hidden');
    }
}

modalOpenButtons.forEach(function(arrayItem){
    arrayItem.addEventListener('click', function(evt) {
        evt.preventDefault();
        toggleModalWindow(true);
    })
});

modalCloseButtons.forEach(function(arrayItem){
    arrayItem.addEventListener('click', function(evt) {
        evt.preventDefault();
        toggleModalWindow(false);
    })
});

document.addEventListener('click', function(evt) {
    if (
        isModalWindowOpen &&
        evt.target.contains(modalWindow) &&
        evt.target !== modalWindow
    ) {
        toggleModalWindow(false);
    }
})

window.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    if (isModalWindowOpen) {
      modalWrapper.classList.add('modal__wrapper_hidden');
    }
  }
});
