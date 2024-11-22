document.addEventListener('click', (event) => {
    if (event.target.classList.contains('copyable__button')) {
        let copyable = event.target.closest('.copyable');
        let textArea = copyable.querySelector('.input');
        navigator.clipboard
            .writeText(copyable.textContent)
            .then(() => copyable.classList.add('copyable--success'))
            .catch(console.error);
    }
});
