let sidebar = document.querySelector('.sidebar');

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('header__burger')) {
        sidebar.classList.add('sidebar--open');
    } else if (event.target.classList.contains('sidebar__close')) {
        sidebar.classList.remove('sidebar--open');
    }
});
