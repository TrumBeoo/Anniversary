/**
 * Quản lý tất cả hiệu ứng animation
 */

/**
 * Khởi tạo Scene 0 - Airplane Animation
 */
function initScene0() {
    const scene0 = document.getElementById('scene0');
    const scene1 = document.getElementById('scene1');
    const airplaneDiv = document.getElementById('airplane');
    const letterDiv = document.getElementById('letter');
    const letterAnimation = document.getElementById('letterAnimation');
    
    // Tạo Lottie animation cho máy bay
    airplaneDiv.innerHTML = '<lottie-player src="./animations/Airplane flying.json" background="transparent" speed="0.5" style="width: 300px; height: 300px;" loop autoplay></lottie-player>';
    
    // Hiển thị Scene 0
    scene0.style.display = 'block';
    
    // Đợi Lottie player load xong rồi dừng animation
    setTimeout(() => {
        console.log('Checking letterAnimation:', letterAnimation);
        if (letterAnimation) {
            letterAnimation.stop();
            console.log('Animation stopped');
        }
    }, 100);
    
    // Thêm class zoom-in ngay từ đầu để có hiệu ứng thả xuống và zoom in
    letterDiv.classList.add('zoom-in');
    
    // Sau 6 giây (khi thư đã zoom in xong), thêm khả năng click
    setTimeout(() => {
        letterDiv.classList.add('clickable');
        
        // Thêm event listener cho click vào letter
        letterDiv.addEventListener('click', function() {
            if (!letterDiv.classList.contains('clicked')) {
                letterDiv.classList.add('clicked');
                
                // Bật animation mở thư
                if (letterAnimation) {
                    letterAnimation.play();
                }
                
                // Sau 2 giây chuyển sang Scene 1
                setTimeout(() => {
                    scene0.classList.add('hidden');
                    scene1.classList.add('active');
                }, 2000);
            }
        });
    }, 6000);
}

/**
 * Khởi động ứng dụng
 */
function startApp() {
    initScene0();
}

/**
 * Bắt đầu hiệu ứng rơi tim
 */
function startFallingHearts() {
    const fallingHearts = document.getElementById('fallingHearts');
    fallingHearts.style.display = 'block';
    
    // Tạo tim rơi định kỳ
    const heartInterval = setInterval(() => {
        if (!document.body.classList.contains('scene2-active')) {
            clearInterval(heartInterval);
            return;
        }
        createFallingHeart();
    }, 800);
    
    // Lưu interval để có thể clear sau
    window.heartInterval = heartInterval;
}

/**
 * Tạo một trái tim rơi mới
 */
function createFallingHeart() {
    const fallingHearts = document.getElementById('fallingHearts');
    
    if (!fallingHearts || fallingHearts.style.display === 'none') {
        return;
    }
    
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = Math.random() > 0.5 ? '💖' : '💕';
    heart.style.left = Math.random() * 100 + '%';
    
    const duration = Math.random() * 2 + 3;
    const size = Math.random() * 0.5 + 1;
    
    heart.style.animationDuration = duration + 's';
    heart.style.fontSize = size + 'rem';
    
    fallingHearts.appendChild(heart);
    
    // Xóa tim sau khi animation kết thúc
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, duration * 1000);
}

/**
 * Optimize animations for mobile
 */
function optimizeAnimationsForMobile() {
    const isMobile = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isMobile || prefersReducedMotion) {
        // Giảm số lượng star animation trên mobile
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index > 2) {
                star.style.display = 'none';
            }
        });
    }
}

/**
 * Handle window resize
 */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        optimizeAnimationsForMobile();
    }, 250);
});

// Initialize optimization on load
document.addEventListener('DOMContentLoaded', () => {
    optimizeAnimationsForMobile();
});

/**
 * Lazy load animations
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const memoryContents = document.querySelectorAll('.memory-content');
    memoryContents.forEach(content => observer.observe(content));
    
    // Khởi động ứng dụng với Scene 0
    startApp();
});
