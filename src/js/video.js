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
