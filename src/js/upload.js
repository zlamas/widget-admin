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
