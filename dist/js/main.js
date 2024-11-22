let colorPicker = document.querySelector('.color-picker');
let colorArea, hueSlider, valueFields, colorMarker, colorField, colorAreaRect;

function hexToRgb(hex) {
    return hex
        .slice(1)
        .match(/.{2}/g)
        .map((hex) => parseInt(hex, 16));
}

function rgbToHex(rgb) {
    return `#${rgb
        .map((val) => val.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
    }`;
}

function rgbToHsv(red, green, blue) {
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const d = max - min;
    let hue = 0;
    const saturation = max ? (d / max) : 0;
    const value = max / 255;

    if (d != 0) {
        switch (max) {
            case red: hue = ((green - blue) / d + 6) % 6; break;
            case green: hue = (blue - red) / d + 2; break;
            case blue: hue = (red - green) / d + 4;
        }
    }

    return [Math.round(hue * 60), saturation, value];
}

function hsvToRgb(hue, saturation, value) {
    hue /= 60;

    const chroma = saturation * value;
    const x = chroma * (1 - Math.abs(hue % 2 - 1));
    const m = value - chroma;

    const index = Math.floor(hue) % 6;
    const red = [chroma, x, 0, 0, x, chroma][index];
    const green = [x, chroma, chroma, x, 0, 0][index];
    const blue = [0, 0, x, chroma, chroma, x][index];

    return [
        Math.round((red + m) * 255),
        Math.round((green + m) * 255),
        Math.round((blue + m) * 255)
    ];
}

function getHsv() {
    return ['--hue', '--sat', '--val']
        .map((prop) => colorPicker.style.getPropertyValue(prop));
}

function initColorPicker() {
    colorArea = colorPicker.querySelector('.color-picker__area');
    hueSlider = colorPicker.querySelector('.color-picker__hue');
    valueFields = colorPicker.querySelectorAll('.color-picker__field');
    colorMarker = colorPicker.querySelector('.color-picker__marker');

    colorPicker.addEventListener('picker-open', openColorPicker);
    colorArea.addEventListener('pointerdown', pickerOnPointerDown);
    document.addEventListener('pointerup', pickerOnPointerUp);
    hueSlider.addEventListener('input', updateHue);
}

function updateColorAreaOffset() {
    let boundingRect = colorArea.getBoundingClientRect();
}

function openColorPicker(target) {
    colorField = event.target.closest('.color');

    colorAreaRect = colorArea.getBoundingClientRect();
    colorAreaRect.y += window.scrollY;

    updateColorPicker(colorField.style.getPropertyValue('--color'));
}

function updateColorPicker(hex) {
    let rgb;

    if (hex) {
        rgb = hexToRgb(hex);
        let [hue, saturation, value] = rgbToHsv(...rgb);

        hueSlider.value = hue;
        updateHue();
        setSaturationValue(saturation, value);
    } else {
        let hsv = getHsv();
        rgb = hsvToRgb(...hsv);
        hex = rgbToHex(rgb);
        colorField.style.setProperty('--color', hex);
    }

    components = [hex, ...rgb];
    valueFields.forEach((field, i) => field.value = components[i]);
    colorField.querySelector('.color__hex').textContent = hex;
}

function updateHue() {
    colorPicker.style.setProperty('--hue', hueSlider.value);
    updateColorPicker();
}

function setSaturationValue(saturation, value) {
    colorPicker.style.setProperty('--sat', saturation);
    colorPicker.style.setProperty('--val', value);
    updateColorPicker();
}

function updateSaturationValue(event) {
    if (event.buttons & 1) {
        let saturation = (event.pageX - colorAreaRect.x) / colorAreaRect.width;
        let value = 1 - (event.pageY - colorAreaRect.y) / colorAreaRect.height;
        saturation = Math.max(0, Math.min(saturation, 1));
        value = Math.max(0, Math.min(value, 1));
        setSaturationValue(saturation, value);
    }
}

function pickerOnPointerDown(event) {
    document.addEventListener('pointermove', updateSaturationValue);
    updateSaturationValue(event);
}

function pickerOnPointerUp(event) {
    document.removeEventListener('pointermove', updateSaturationValue);

    let target = event.target;

    if (target.closest('.color__icon')
    && !target.closest('.picker-open')) {
        let hex = target.dataset.color;
        let colorField = target.closest('.color');
        let colorHex = colorField.querySelector('.color__hex');
        colorField.style.setProperty('--color', hex);
        colorHex.textContent = hex;
    }
}

if (colorPicker) {
    initColorPicker();
}

document.querySelectorAll('.color__icon')
    .forEach((el) => {
        if (el.classList.contains('color--current')) {
            el.closest('.color')
                .style.setProperty('--color', el.dataset.color);
        } else {
            el.style.background = el.dataset.color;
        }
    });

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

document.querySelectorAll('.expand')
    .forEach((el) => {
        let toCollapse = document.querySelectorAll(el.dataset.collapse);
        el.addEventListener('click', (event) => {
            el.classList.toggle('expand--expanded');
            toCollapse.forEach((el) => el.classList.toggle('hidden'));
        });
    });

let sidebar = document.querySelector('.sidebar');

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('header__burger')) {
        sidebar.classList.add('sidebar--open');
    } else if (event.target.classList.contains('sidebar__close')) {
        sidebar.classList.remove('sidebar--open');
    }
});

let widgetList = document.querySelector('.widget-list--types');
let createWidget = document.querySelector('#create-widget');
let multiList = document.querySelector('#multi-list');

if (widgetList) {
    widgetList.addEventListener('click', (event) => {
        let item = event.target.closest('.widget-list__type');
        if (item) {
            createWidget.classList.add('hidden');
            multiList.classList.remove('hidden');

            let selectedItem = widgetList.querySelector('.widget-list__type--selected');

            if (selectedItem) {
                selectedItem.classList.remove('widget-list__type--selected');
            }

            if (item != selectedItem) {
                item.classList.add('widget-list__type--selected');
            }
        }
    });
}

let multiPresetList = document.querySelector('.multi-presets--scrollable');
let variantList = document.querySelector('.variant-list');
let iconPicker = document.querySelector('.icon-picker');
let uploadPicker = document.querySelector('.upload-picker');
let addVariant = document.querySelector('.add-variant');
let multiVariantOptions = document.querySelector('#multi-variant-options');

if (multiPresetList) {
    multiPresetList.addEventListener('click', (event) => {
        let preset = event.target.closest('.multi-preset');
        if (preset) {
            multiPresetList.querySelector('.multi-preset--selected')
                .classList.remove('multi-preset--selected');
            preset.classList.add('multi-preset--selected');
        }
    });
}

if (variantList) {
    variantList.addEventListener('click', (event) => {
        if (event.target.closest('.icon-button--nav')) {
            let selectedItem = variantList.querySelector('.variant-list__item--selected');
            let itemToSelect;

            if (event.target.closest('.icon-button--up')) {
                itemToSelect = selectedItem.previousElementSibling;
            } else if (event.target.closest('.icon-button--down')) {
                itemToSelect = selectedItem.nextElementSibling;
            }

            if (itemToSelect) {
                selectedItem.classList.remove('variant-list__item--selected');
                itemToSelect.classList.add('variant-list__item--selected');
            }
        }
    });
}

if (iconPicker) {
    iconPicker.addEventListener('click', (event) => {
        if (event.target.closest('.icon-picker__icon')) {
            iconPicker.style.visibility = '';
            event.stopPropagation();
        }
    });
}

if (uploadPicker) {
    uploadPicker.addEventListener('click', (event) => {
        if (event.target.closest('.icon-button--close')
        ||  event.target.closest('.button')) {
            uploadPicker.style.visibility = '';
            event.stopPropagation();
        }
    });
}

if (multiVariantOptions) {
    document.addEventListener('click', (event) => {
        if (event.target.closest('.add-variant')
        ||  event.target.closest('.edit-variant')) {
            multiVariantOptions.classList.remove('hidden');
        }
    });
}

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

let popup = document.querySelector('.popup');

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('help')) {
        popup.classList.add('popup--open');
    } else if (event.target.classList.contains('popup__close')) {
        popup.classList.remove('popup--open');
    }
});

function updateRange(range) {
    let input = range.querySelector('.range__input');
    let tooltip = range.querySelector('.tooltip');
    let valueDisplay = range.querySelector('.range__percent');
    let percent =
        (input.value - input.min) /
        (input.max - input.min)
        * 100;

    range.style.setProperty('--range-progress', `${percent}%`);
    if (tooltip) {
        tooltip.textContent = input.valueAsNumber.toFixed(2);
    }
    if (valueDisplay) {
        valueDisplay.textContent = `${Math.round(percent)}%`;
    }
}

document.querySelectorAll('.range')
    .forEach((range) => {
        updateRange(range);
        range.addEventListener('input', () => updateRange(range));
    });

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

let uploadPreviews = document.querySelectorAll('.upload__preview');

document.addEventListener('input', (event) => {
    let uploadPreview = event.target.closest('.upload__preview');
    if (uploadPreview) {
        uploadPreview.classList.remove('hidden');
    }
});

document.addEventListener('click', (event) => {
    let uploadPreview = event.target.closest('.upload__preview');
    if (uploadPreview && event.target.closest('.delete')) {
        uploadPreview.classList.add('hidden');
    }
});

let videoUploadArea = document.querySelector('.upload-video');
let videoContent = document.querySelector('.video');

if (videoContent) {
    document.addEventListener('input', (event) => {
        if (event.target.id == 'upload-video') {
            videoUploadArea.classList.add('hidden');
            videoContent.classList.remove('hidden');
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('.delete')
        && videoContent.contains(event.target)) {
            videoContent.classList.add('hidden');
            videoUploadArea.classList.remove('hidden');
        }
    });
}

let preview = document.querySelector('.widget-preview__block');
let previewSliderX, previewSliderY;

function updatePreview() {
    let valueX = previewSliderX.value;
    let valueY = previewSliderY.value;
    preview.style.setProperty('--widget-x', `${valueX}%`);
    preview.style.setProperty('--widget-y', `${valueY}%`);
}

function initPreview() {
    [previewSliderX, previewSliderY] = preview.querySelectorAll(`
        .widget-preview__slider--horizontal .range__input,
        .widget-preview__slider--vertical .range__input
    `);
    preview.addEventListener('input', updatePreview);
    updatePreview();
}

if (preview) {
    initPreview();
}

//# sourceMappingURL=main.js.map
