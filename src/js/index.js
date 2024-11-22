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
