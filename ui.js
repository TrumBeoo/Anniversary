/**
 * Quản lý UI và chuyển Scene
 */

let cardFlipped = false;
let typingTimeout; // Biến để lưu trữ timeout của hiệu ứng gõ chữ

/**
 * Hiệu ứng gõ chữ với kiểm tra weight của card và xuống dòng
 * @param {HTMLElement} element - Phần tử HTML để hiển thị chữ.
 * @param {string} text - Nội dung chữ cần gõ.
 * @param {function} onComplete - Callback sẽ được gọi khi gõ xong.
 */
function typewriterEffect(element, text, onComplete) {
    // Dừng và xóa hiệu ứng gõ chữ cũ (nếu có)
    clearTimeout(typingTimeout);
    
    let i = 0;
    const speed = 50; // Tốc độ gõ (ms trên mỗi ký tự)
    element.innerHTML = ''; // Xóa nội dung cũ
    
    // Kiểm tra weight của card để chỉ gõ trong card
    const card = document.getElementById('card');
    if (!card || !card.classList.contains('flipped')) {
        return; // Không gõ nếu card không được lật
    }

    function type() {
        // Kiểm tra lại weight của card trong quá trình gõ
        if (!card.classList.contains('flipped')) {
            clearTimeout(typingTimeout);
            return;
        }
        
        if (i < text.length) {
            const char = text.charAt(i);
            
            // Kiểm tra xuống dòng tự động khi gặp dấu cách và độ dài dòng
            if (char === ' ' && element.textContent.length > 0) {
                const words = element.textContent.split(' ');
                const currentLine = words[words.length - 1] || '';
                
                // Xuống dòng nếu dòng hiện tại quá dài (> 40 ký tự)
                if (currentLine.length > 40) {
                    element.innerHTML += '<br>';
                } else {
                    element.innerHTML += char;
                }
            } else {
                element.innerHTML += char;
            }
            
            i++;
            typingTimeout = setTimeout(type, speed);
        } else if (onComplete) {
            onComplete(); // Gọi callback khi đã gõ xong
        }
    }
    type();
}

/**
 * Lật thẻ card
 */
function flipCard() {
    const card = document.getElementById('card');
    const cardExploreBtn = document.getElementById('cardExploreBtn');
    const cardMessageEl = document.getElementById('cardMessage');
    
    // Toggle a class on the card to trigger the flip animation
    card.classList.toggle('flipped');
    cardFlipped = !cardFlipped;

    if (cardFlipped) {
        // Lấy nội dung gốc đã được render từ config.js
        const originalMessage = cardMessageEl.getAttribute('data-text');

        // Bắt đầu hiệu ứng gõ chữ sau khi card lật xong
        setTimeout(() => {
            // Kiểm tra weight của card trước khi bắt đầu gõ
            if (card.classList.contains('flipped')) {
                // Bắt đầu gõ chữ, và hiển thị nút khi gõ xong
                typewriterEffect(cardMessageEl, originalMessage, () => {
                    // Chỉ hiển thị nút nếu card vẫn đang ở mặt sau
                    if (card.classList.contains('flipped')) {
                        cardExploreBtn.style.display = 'flex';
                        cardExploreBtn.style.animation = 'fadeInUp 0.5s ease-out forwards';
                    }
                });
            }
        }, 600); // Đợi 0.6s cho animation lật thẻ gần xong
    } else {
        // Nếu lật lại mặt trước, dừng hiệu ứng gõ chữ và ẩn nút
        clearTimeout(typingTimeout);
        cardMessageEl.innerHTML = ''; // Xóa nội dung đã gõ
        cardExploreBtn.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => { cardExploreBtn.style.display = 'none'; }, 300);
    }
}

/**
 * Chuyển tới Scene 2 (Memories)
 */
function goToScene2() {
    const scene1 = document.getElementById('scene1');
    const backBtn = document.getElementById('backBtn');
    
    // Bật scrolling và kích hoạt scene 2
    document.body.classList.add('scene2-active');
    
    // Di chuyển scene 1 lên trên
    scene1.classList.add('hidden');
    backBtn.style.display = 'block';
    
    // Bắt đầu hiệu ứng rơi tim
    startFallingHearts();
    
    // Hoàn thành transition
    setTimeout(() => {
        window.scrollTo(0, 0);
        initScrollAnimations();
    }, 1000);
}

/**
 * Chuyển tới Scene 3 (Letter)
 */
function goToScene3() {
    document.body.classList.add('scene3-active');
    
    const backBtn = document.getElementById('backBtn');
    const backBtn3 = document.getElementById('backBtn3');
    
    backBtn.style.display = 'none';
    backBtn3.style.display = 'block';
    
    // Reset trạng thái lá thư
    if (typeof letterOpened !== 'undefined') {
        letterOpened = false;
    }
    
    // Kích hoạt hiệu ứng lá thư ngay lập tức
    setTimeout(() => {
        const letter = document.getElementById('handwrittenLetter');
        if (letter) {
            letter.classList.add('visible');
            // Tự động mở lá thư và bắt đầu viết
            setTimeout(() => {
                if (window.initHandwrittenLetter) {
                    if (typeof window.letterOpened !== 'undefined') {
                        window.letterOpened = true;
                    }
                    letter.classList.add('opening');
                    window.initHandwrittenLetter();
                }
            }, 500);
        }
    }, 500);
}

/**
 * Quay lại Scene 2 từ Scene 3
 */
function goBackToScene2() {
    document.body.classList.remove('scene3-active');
    
    const backBtn = document.getElementById('backBtn');
    const backBtn3 = document.getElementById('backBtn3');
    
    backBtn.style.display = 'block';
    backBtn3.style.display = 'none';
}

/**
 * Quay lại Scene 1 (Card)
 */
function goBackToCard() {
    const scene1 = document.getElementById('scene1');
    const backBtn = document.getElementById('backBtn');
    const fallingHearts = document.getElementById('fallingHearts');
    
    // Tắt scrolling và reset scene 2
    document.body.classList.remove('scene2-active', 'scene3-active');
    
    // Hiện scene 1
    backBtn.style.display = 'none';
    fallingHearts.style.display = 'none';
    
    setTimeout(() => {
        scene1.classList.remove('hidden');
        window.scrollTo(0, 0);
    }, 100);
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const memoryContents = document.querySelectorAll('.memory-content');
    
    function checkScroll() {
        memoryContents.forEach(content => {
            const rect = content.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8;
            
            if (isVisible) {
                content.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check initial state
}

// Lưu trữ nội dung gốc của card message vào một data attribute khi trang tải xong
// để hàm typewriter có thể truy cập mà không bị ảnh hưởng bởi các thay đổi innerHTML
document.addEventListener('DOMContentLoaded', () => {
    const cardMessageEl = document.getElementById('cardMessage');
    if (cardMessageEl) {
        // Chờ một chút để đảm bảo render từ config.js đã chạy
        setTimeout(() => {
            const originalText = cardMessageEl.textContent;
            cardMessageEl.setAttribute('data-text', originalText);
            // Xóa nội dung ban đầu để chuẩn bị cho hiệu ứng gõ chữ
            cardMessageEl.innerHTML = '';
        }, 100);
    }
});


/**
 * Add fade-in animation và styling cho card message
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    .card-message {
        line-height: 1.6;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
`;
document.head.appendChild(style);