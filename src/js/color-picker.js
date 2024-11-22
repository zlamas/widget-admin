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
