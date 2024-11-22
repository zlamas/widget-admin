document.querySelectorAll('.expand')
    .forEach((el) => {
        let toCollapse = document.querySelectorAll(el.dataset.collapse);
        el.addEventListener('click', (event) => {
            el.classList.toggle('expand--expanded');
            toCollapse.forEach((el) => el.classList.toggle('hidden'));
        });
    });
