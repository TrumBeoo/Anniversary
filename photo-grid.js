// Photo Grid Modal Functions
function initPhotoGrid() {
    const photoItems = document.querySelectorAll('.photo-item');
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    photoItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title');
            const message = item.getAttribute('data-message');
            const imgSrc = item.querySelector('img').src;
            const imgAlt = item.querySelector('img').alt;

            modalImage.src = imgSrc;
            modalImage.alt = imgAlt;
            modalTitle.textContent = title;
            modalMessage.textContent = message;

            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('photoModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initPhotoGrid();
});