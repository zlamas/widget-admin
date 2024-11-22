document.querySelectorAll('.radio-toggle')
    .forEach((el) => {
        let radios = el.querySelectorAll('.option__input');
        el.addEventListener('change', (event) => {
            if (event.target.type != 'radio') return;
            radios.forEach((radio) => {
                let isChecked = (event.target == radio);
                let toToggle = document.querySelectorAll(radio.dataset.toggle);
                toToggle.forEach((el) => el.classList.toggle('hidden', !isChecked));
            });
        });
    });
