// Photo Grid Modal Functions
function initPhotoGrid() {
    const photoItems = document.querySelectorAll('.photo-item');
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    // Variables for rotation functionality
    let isRotating = false;
    let startX = 0;
    let currentRotation = 0;
    let rotatingSlide = null;
    let swiperInstance = null;

    // Initialize Swiper
    swiperInstance = new Swiper('.photo-grid', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 3,
        loop: true,
        speed: 300,
        autoplay: {
            delay: 1500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        coverflowEffect: {
            rotate: 30,
            stretch: 0,
            depth: 200,
            modifier: 1.5,
            slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        initialSlide: 2,
        perspective: true,
        watchSlidesProgress: true,
        on: {
            progress: function() {
                const swiper = this;
                for (let i = 0; i < swiper.slides.length; i++) {
                    const slideProgress = swiper.slides[i].progress;
                    const absProgress = Math.abs(slideProgress);
                    let scale, translate, opacity;
                    
                    if (absProgress > 0) {
                        opacity = 1 - absProgress / 3;
                        scale = 1 - absProgress / 5;
                        translate = `${slideProgress * 50}%`;
                    } else {
                        opacity = 1;
                        scale = 1;
                        translate = '0%';
                    }
                    
                    swiper.slides[i].style.opacity = opacity;
                    swiper.slides[i].style.transform = 
                        `translateX(${translate}) scale(${scale})`;
                }
            },
            setTransition: function(speed) {
                const swiper = this;
                for (let i = 0; i < swiper.slides.length; i++) {
                    swiper.slides[i].style.transition = `${speed}ms`;
                }
            }
        }
    });

    // Add rotation functionality to slides
    function initSlideRotation() {
        const slides = document.querySelectorAll('.swiper-slide');
        
        slides.forEach(slide => {
            let slideRotation = 0;
            
            // Mouse events
            slide.addEventListener('mousedown', (e) => {
                if (e.button === 0) { // Left mouse button
                    isRotating = true;
                    startX = e.clientX;
                    rotatingSlide = slide;
                    slideRotation = getCurrentRotation(slide);
                    
                    slide.classList.add('dragging', 'rotating');
                    swiperInstance.autoplay.stop();
                    e.preventDefault();
                }
            });
            
            // Touch events for mobile - only start rotation on long press
            let touchStartTime = 0;
            let rotationStarted = false;
            
            slide.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                rotationStarted = false;
                startX = e.touches[0].clientX;
                rotatingSlide = slide;
                slideRotation = getCurrentRotation(slide);
                
                // Start rotation after a delay to avoid conflicts with tap
                setTimeout(() => {
                    if (rotatingSlide === slide && Date.now() - touchStartTime > 300) {
                        isRotating = true;
                        rotationStarted = true;
                        slide.classList.add('dragging', 'rotating');
                        swiperInstance.autoplay.stop();
                    }
                }, 300);
            }, { passive: true });
        });
    }
    
    // Global mouse/touch move events
    document.addEventListener('mousemove', (e) => {
        if (isRotating && rotatingSlide) {
            const deltaX = e.clientX - startX;
            const rotationAmount = deltaX * 0.5; // Adjust sensitivity
            const newRotation = currentRotation + rotationAmount;
            
            applyRotation(rotatingSlide, newRotation);
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        if (isRotating && rotatingSlide) {
            const deltaX = e.touches[0].clientX - startX;
            const rotationAmount = deltaX * 0.5;
            const newRotation = currentRotation + rotationAmount;
            
            applyRotation(rotatingSlide, newRotation);
            e.preventDefault();
        }
    }, { passive: false });
    
    // Global mouse/touch end events
    document.addEventListener('mouseup', () => {
        if (isRotating && rotatingSlide) {
            endRotation();
        }
    });
    
    document.addEventListener('touchend', () => {
        // Reset rotation state
        if (rotatingSlide) {
            if (isRotating) {
                endRotation();
            } else {
                // Clean up if rotation never started
                rotatingSlide = null;
            }
        }
    });
    
    function getCurrentRotation(slide) {
        const transform = slide.style.transform || '';
        const rotateYMatch = transform.match(/rotateY\(([^)]+)\)/);
        return rotateYMatch ? parseFloat(rotateYMatch[1]) : 0;
    }
    
    function applyRotation(slide, rotation) {
        const photoItem = slide.querySelector('.photo-item');
        if (photoItem) {
            // Preserve existing transforms and add rotation
            const existingTransform = slide.style.transform || '';
            const cleanTransform = existingTransform.replace(/rotateY\([^)]*\)/g, '').trim();
            const newTransform = `${cleanTransform} rotateY(${rotation}deg)`.trim();
            
            slide.style.transform = newTransform;
            currentRotation = rotation;
        }
    }
    
    function endRotation() {
        if (rotatingSlide) {
            rotatingSlide.classList.remove('dragging', 'rotating');
            
            // Smooth return to original position
            setTimeout(() => {
                if (rotatingSlide) {
                    const existingTransform = rotatingSlide.style.transform || '';
                    const cleanTransform = existingTransform.replace(/rotateY\([^)]*\)/g, '').trim();
                    rotatingSlide.style.transform = cleanTransform;
                    rotatingSlide.style.transition = 'transform 0.5s ease';
                    
                    // Remove transition after animation
                    setTimeout(() => {
                        if (rotatingSlide) {
                            rotatingSlide.style.transition = '';
                        }
                    }, 500);
                }
            }, 100);
            
            // Resume autoplay after a short delay
            setTimeout(() => {
                swiperInstance.autoplay.start();
            }, 1000);
        }
        
        isRotating = false;
        rotatingSlide = null;
        currentRotation = 0;
    }
    
    // Initialize rotation after swiper is ready
    setTimeout(() => {
        initSlideRotation();
    }, 100);

    // Variables for touch/click detection
    let touchStartTime = 0;
    let touchMoved = false;
    let clickTimeout = null;

    photoItems.forEach(item => {
        // Touch start - record time and reset moved flag
        item.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchMoved = false;
        }, { passive: true });

        // Touch move - set moved flag
        item.addEventListener('touchmove', (e) => {
            touchMoved = true;
        }, { passive: true });

        // Touch end - handle as click if conditions are met
        item.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            
            // If touch was short and didn't move much, treat as click
            if (touchDuration < 500 && !touchMoved && !isRotating) {
                e.preventDefault();
                openPhotoModal(item);
            }
        });

        // Regular click for desktop
        item.addEventListener('click', (e) => {
            // Only handle click if not on mobile (no recent touch)
            if (Date.now() - touchStartTime > 1000 && !isRotating) {
                openPhotoModal(item);
            }
        });
    });

    // Function to open photo modal
    function openPhotoModal(item) {
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
    }

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