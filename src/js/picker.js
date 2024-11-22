document.querySelectorAll('.picker-open')
    .forEach((el) => {
        let picker = document.querySelector(el.dataset.picker);

        el.addEventListener('click', () => {
            el.append(picker);

            let pickerOffset = picker.getBoundingClientRect();
            let overflow = window.innerWidth - pickerOffset.right;

            if (overflow < 0) {
                picker.style.setProperty('--offset', `${overflow}px`);
            }

            picker.style.visibility = 'visible';
            picker.dispatchEvent(new Event('picker-open'));
        });
    });

document.querySelectorAll('.picker')
    .forEach((picker) => {
        let isDragging = false;

        function onPointerMove() {
            isDragging = true;
        }

        document.addEventListener('pointerup', (event) => {
            document.removeEventListener('pointermove', onPointerMove);

            if (!isDragging && !picker.contains(event.target)) {
                picker.style.visibility = '';
            } else {
                isDragging = false;
            }
        });

        picker.addEventListener('pointerdown', (event) => {
            document.addEventListener('pointermove', onPointerMove);
        });
    });
