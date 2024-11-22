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
