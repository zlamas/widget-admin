let popup = document.querySelector('.popup');

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('help')) {
        popup.classList.add('popup--open');
    } else if (event.target.classList.contains('popup__close')) {
        popup.classList.remove('popup--open');
    }
});
