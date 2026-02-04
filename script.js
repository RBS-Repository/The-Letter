/* --- Custom Alert Logic --- */
function customAlert(title, message) {
    const overlay = document.querySelector('.custom-alert-overlay');
    const boxTitle = overlay.querySelector('h3');
    const boxMsg = overlay.querySelector('p');

    boxTitle.textContent = title;
    boxMsg.textContent = message;

    overlay.classList.add('active');
}

function closeAlert() {
    document.querySelector('.custom-alert-overlay').classList.remove('active');
}

/* --- Audio Autoplay --- */
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-music');
    const playOnInteraction = () => {
        audio.play().then(() => {
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
        }).catch(err => { });
    };
    document.addEventListener('click', playOnInteraction);
    document.addEventListener('touchstart', playOnInteraction);

    observeFinale();
    setupKeyGame();

    // Close alert on outside click
    document.querySelector('.custom-alert-overlay').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.custom-alert-overlay')) {
            closeAlert();
        }
    });
});

/* --- Finale Observer --- */
function observeFinale() {
    const trigger = document.getElementById('finale-trigger');
    const overlay = document.querySelector('.finale-overlay');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                overlay.classList.add('active');
            }
        });
    }, { threshold: 0.1 }); // Trigger as soon as the empty footer slide is visible

    if (trigger) observer.observe(trigger);
}

/* --- Draggable Cube --- */
const cube = document.querySelector('.cube');
const scene = document.querySelector('.scene');
let isDragging = false;
let startX, startY;
let currentX = 0, currentY = 0;
let initialRotationX = 10, initialRotationY = 0;
const handleStart = (x, y) => { isDragging = true; startX = x; startY = y; cube.style.animation = 'none'; };
const handleMove = (x, y) => {
    if (!isDragging) return;
    const deltaX = x - startX;
    const deltaY = y - startY;
    currentY = initialRotationY + deltaX * 0.5;
    currentX = initialRotationX - deltaY * 0.5;
    cube.style.transform = `translateZ(-150px) rotateY(${currentY}deg) rotateX(${currentX}deg)`;
};
const handleEnd = () => { if (isDragging) { isDragging = false; initialRotationY = currentY; initialRotationX = currentX; } };

if (scene) {
    scene.addEventListener('mousedown', e => handleStart(e.clientX, e.clientY));
    document.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', handleEnd);
    scene.addEventListener('touchstart', e => handleStart(e.touches[0].clientX, e.touches[0].clientY));
    document.addEventListener('touchmove', e => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); });
    document.addEventListener('touchend', handleEnd);
}

/* --- Timer --- */
const startDate = new Date(2023, 1, 14);
function updateTimer() {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    if (document.getElementById('days')) {
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }
}
setInterval(updateTimer, 1000);
updateTimer();

/* --- Quiz --- */
window.checkAnswer = function (btn, isCorrect) {
    if (isCorrect) {
        btn.style.background = '#4CAF50'; btn.style.color = 'white'; btn.innerHTML = 'Correct! ❤️';
        const parent = btn.closest('.question');
        setTimeout(() => {
            parent.style.display = 'none';
            const next = parent.nextElementSibling;
            if (next) next.style.display = 'block';
            else customAlert("Quiz Complete!", "You know me so well! ❤️");
        }, 1000);
    } else {
        btn.style.background = '#f44336'; btn.style.color = 'white'; btn.innerHTML = 'Try Again 🥺';
        setTimeout(() => { btn.style.background = 'none'; btn.style.color = 'var(--primary-color)'; btn.innerHTML = 'Try Again'; }, 1500);
    }
}

/* --- Bottle --- */
const messages = ["You are my favorite person.", "I love you more than words can say.", "Your smile lights up my world.", "I want to be with you forever."];
window.openBottle = function () {
    const msgDiv = document.getElementById('bottle-message');
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    msgDiv.textContent = `"${randomMsg}"`;
    msgDiv.classList.add('visible');
}

/* --- Key Game --- */
function setupKeyGame() {
    const container = document.querySelector('.key-game');
    if (!container) return;
    for (let i = 0; i < 5; i++) {
        const decoy = document.createElement('div');
        decoy.innerHTML = '🗝️';
        decoy.style.position = 'absolute';
        decoy.style.left = Math.random() * 250 + 'px';
        decoy.style.top = Math.random() * 250 + 'px';
        decoy.style.opacity = '0.3';
        decoy.style.cursor = 'pointer';
        decoy.onclick = () => { decoy.style.display = 'none'; customAlert("Oops!", "Wrong key! Try another one."); };
        container.appendChild(decoy);
    }
    const realKey = document.createElement('div');
    realKey.innerHTML = '🔑';
    realKey.style.position = 'absolute';
    realKey.style.left = Math.random() * 200 + 50 + 'px';
    realKey.style.top = Math.random() * 200 + 50 + 'px';
    realKey.style.cursor = 'pointer';
    realKey.style.fontSize = '24px';
    realKey.onclick = () => {
        document.querySelector('.locked-heart').innerHTML = '💖';
        customAlert("Unlocked!", "You hold the key to my heart! Forever.");
        realKey.style.display = 'none';
    };
    container.appendChild(realKey);
}

/* --- Affirmations --- */
const affirmations = ["You are incredible.", "You are loved.", "You make the world better.", "Your laugh is magic."];
let affIndex = 0;
window.nextAffirmation = function () {
    affIndex = (affIndex + 1) % affirmations.length;
    document.getElementById('aff-text').textContent = affirmations[affIndex];
}
