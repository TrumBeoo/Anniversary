/**
 * Quản lý hiệu ứng thiệp viết tay
 */

let letterTypingInProgress = false;
let letterOpened = false;

/**
 * Hiệu ứng viết tay từng chữ
 */
function handwriteText(element, text, speed = 80) {
    return new Promise((resolve) => {
        element.innerHTML = '';
        element.classList.add('started');
        
        let i = 0;
        const typeChar = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeChar, speed + Math.random() * 40);
            } else {
                resolve();
            }
        };
        
        typeChar();
    });
}

/**
 * Mở lá thư và bắt đầu hiệu ứng viết
 */
function openLetter() {
    const letter = document.getElementById('handwrittenLetter');
    if (!letter || window.letterOpened) return;
    
    window.letterOpened = true;
    
    // Xóa class folded và thêm class opening
    letter.classList.remove('folded');
    letter.classList.add('opening');
    
    // Bắt đầu hiệu ứng viết tay ngay lập tức
    initHandwrittenLetter();
}

/**
 * Khởi tạo hiệu ứng thiệp viết tay
 */
async function initHandwrittenLetter() {
    if (letterTypingInProgress) return;
    letterTypingInProgress = true;
    
    const handwriteElements = document.querySelectorAll('.handwrite-text');
    
    // Reset tất cả text trước khi bắt đầu
    handwriteElements.forEach(element => {
        element.innerHTML = '';
        element.classList.remove('started');
    });
    
    // Viết từng dòng một cách tuần tự ngay lập tức
    for (let element of handwriteElements) {
        const text = element.getAttribute('data-text');
        if (text) {
            element.classList.add('started');
            await handwriteText(element, text, 50); // Tăng tốc độ viết
            await new Promise(resolve => setTimeout(resolve, 200)); // Giảm delay
        }
    }
    
    letterTypingInProgress = false;
}

// Expose function globally
window.initHandwrittenLetter = initHandwrittenLetter;

/**
 * Khởi tạo observer cho thiệp viết tay
 */
function initHandwrittenLetterObserver() {
    const letter = document.getElementById('handwrittenLetter');
    if (letter) {
        // Thêm event listener cho click
        letter.addEventListener('click', openLetter);
    }
}

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initHandwrittenLetterObserver();
});