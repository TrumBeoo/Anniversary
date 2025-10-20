/**
 * Quản lý âm thanh nền
 */

let isMusicPlaying = false;
const bgMusic = document.getElementById('bgMusic');
const audioControl = document.getElementById('audioControl');

/**
 * Toggle âm nhạc
 */
function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        audioControl.textContent = '🔇';
        isMusicPlaying = false;
    } else {
        bgMusic.play().catch(error => {
            console.log('Auto-play prevented:', error);
        });
        audioControl.textContent = '🔊';
        isMusicPlaying = true;
    }
}

/**
 * Handle auto-play policy
 * Âm nhạc sẽ tự phát khi người dùng tương tác lần đầu
 */
document.addEventListener('click', () => {
    if (!isMusicPlaying) {
        toggleMusic();
    }
}, { once: true });

/**
 * Handle audio errors
 */
bgMusic.addEventListener('error', () => {
    console.log('Error loading audio file');
});

/**
 * Pause music when page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isMusicPlaying) {
        bgMusic.pause();
    } else if (!document.hidden && isMusicPlaying) {
        bgMusic.play().catch(error => {
            console.log('Resume play prevented:', error);
        });
    }
});