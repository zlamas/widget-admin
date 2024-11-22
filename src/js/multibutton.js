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
