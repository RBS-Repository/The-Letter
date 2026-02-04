/* --- Custom Alert Logic --- */
function customAlert(title, message) {
    const overlay = document.querySelector('.custom-alert-overlay');
    const boxTitle = overlay.querySelector('h3');
    const boxMsg = overlay.querySelector('p');
    boxTitle.textContent = title;
    boxMsg.textContent = message;
    overlay.classList.add('active');
}
function closeAlert() { document.querySelector('.custom-alert-overlay').classList.remove('active'); }

document.addEventListener('DOMContentLoaded', () => {
    /* Audio */
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
    createSphere(); // Generate the 3D Sphere of images

    document.querySelector('.custom-alert-overlay').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.custom-alert-overlay')) closeAlert();
    });
});

/* --- Finale Observer --- */
function observeFinale() {
    const trigger = document.getElementById('finale-trigger');
    const overlay = document.querySelector('.finale-overlay');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) overlay.classList.add('active');
        });
    }, { threshold: 0.1 });
    if (trigger) observer.observe(trigger);
}

/* --- 3D PHOTO SPHERE LOGIC --- */
const sphere = document.querySelector('.sphere-wrapper'); // We'll rename carousel to sphere-wrapper
const scene = document.querySelector('.scene');
let isDragging = false;
let startX = 0, startY = 0;
let curRotX = 0, curRotY = 0;
let initRotX = 0, initRotY = 0;

function createSphere() {
    const wrapper = document.querySelector('.sphere-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    // We want ~8-12 images distributed on a sphere
    // Simple approach: 2 Rings of 4, or just Fibonacci Sphere distribution?
    // Let's do 2 Rings of 6 images = 12 images. Or just 8 images (2 rings of 4).
    // User asked for "Octagon" (8) "Sphere". So 8 images.
    // Let's do a single ring of 8 but tilted? No, that's a cylinder.
    // True Sphere: 
    // Image 1: Top (90deg) - maybe not, distortion.
    // Ring A (Top-ish): 4 images. Ring B (Bottom-ish): 4 images.

    const images = [
        'photo1_1770195667147.png', 'photo2_1770195682768.png', 'photo3_1770195698920.png',
        'photo1_1770195667147.png', // repeating for demo
        'photo2_1770195682768.png',
        'photo3_1770195698920.png',
        'photo1_1770195667147.png',
        'photo2_1770195682768.png'
    ];

    // Ring 1: Y rotation 0, 90, 180, 270. X rotation -20deg (looking up)
    // Ring 2: Y rotation 45, 135, 225, 315. X rotation 20deg (looking down)

    images.forEach((src, i) => {
        const face = document.createElement('div');
        face.className = 'sphere-face';
        face.style.backgroundImage = `url('${src}')`;

        let rotY = 0;
        let rotX = 0;

        if (i < 4) {
            // Top Ring
            rotY = i * 90;
            rotX = -15;
        } else {
            // Bottom Ring (offset Y by 45deg)
            rotY = (i - 4) * 90 + 45;
            rotX = 15;
        }

        // Transform: Rotate Y, then Rotate X, then Translate Z
        // Note: order matters.
        face.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(250px)`;
        wrapper.appendChild(face);
    });
}

const handleStart = (x, y) => { isDragging = true; startX = x; startY = y; if (sphere) sphere.style.animation = 'none'; };
const handleMove = (x, y) => {
    if (!isDragging) return;
    const deltaX = x - startX;
    const deltaY = y - startY;
    curRotY = initRotY + deltaX * 0.5;
    curRotX = initRotX - deltaY * 0.5;
    if (sphere) sphere.style.transform = `rotateX(${curRotX}deg) rotateY(${curRotY}deg)`;
};
const handleEnd = () => { if (isDragging) { isDragging = false; initRotY = curRotY; initRotX = curRotX; } };

if (scene) {
    scene.addEventListener('mousedown', e => handleStart(e.clientX, e.clientY));
    document.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', handleEnd);
    scene.addEventListener('touchstart', e => handleStart(e.touches[0].clientX, e.touches[0].clientY), { passive: false });
    document.addEventListener('touchmove', e => { if (isDragging) { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); } }, { passive: false });
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
const messages = [
    "You are my favorite person.", "I love you.", "Your smile lights up my world.", "I want to be with you forever.",
    "You are incredible.", "You are loved.", "You make the world better.", "Your laugh is magic.",
    "You are worthy.", "You are strong.", "You are kind.", "You are beautiful.", "You are my everything.",
    "I appreciate you.", "You are doing great.", "I believe in you.", "You are my safe space."
];
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
        decoy.onclick = () => { decoy.style.display = 'none'; customAlert("Oops!", "Wrong key!"); };
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
        customAlert("Unlocked!", "You hold the key to my heart!");
        realKey.style.display = 'none';
    };
    container.appendChild(realKey);
}

/* --- Affirmations --- */
const affirmations = [
    "You are worthy.", "You are capable.", "You are loved.", "You are strong.", "You are enough.",
    "You are beautiful.", "You are brave.", "You are radiant.", "You are kind.", "You are amazing.",
    "You are smart.", "You are funny.", "You are important.", "You are special."
];
let affIndex = 0;
window.nextAffirmation = function () {
    affIndex = (affIndex + 1) % affirmations.length;
    document.getElementById('aff-text').textContent = affirmations[affIndex];
}
