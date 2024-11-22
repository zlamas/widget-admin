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
