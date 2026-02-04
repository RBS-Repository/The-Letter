/* --- Custom Alert & Open When Logic --- */
function customAlert(title, message) {
    const overlay = document.querySelector('.custom-alert-overlay');
    const boxTitle = overlay.querySelector('h3');
    const boxMsg = overlay.querySelector('p');
    boxTitle.textContent = title;
    boxMsg.textContent = message;
    overlay.classList.add('active');
}
function closeAlert() { document.querySelector('.custom-alert-overlay').classList.remove('active'); }

/* --- Photo Modal Logic --- */
function showPhotoModal(src, caption) {
    const overlay = document.querySelector('.photo-modal-overlay');
    const img = overlay.querySelector('img');
    const txt = overlay.querySelector('.photo-modal-caption');
    img.src = src;
    txt.textContent = caption;
    overlay.classList.add('active');
}
function closePhotoModal() {
    document.querySelector('.photo-modal-overlay').classList.remove('active');
}

window.openWhen = function (mood) {
    let msg = "";
    let title = "";
    switch (mood) {
        case 'sad': title = "When You're Sad"; msg = "Remember that storms don't last forever. I am here for you, always. You are so loved."; break;
        case 'happy': title = "When You're Happy"; msg = "I love seeing you shine! I hope this happiness lasts forever. You deserve it!"; break;
        case 'miss': title = "When You Miss Me"; msg = "Close your eyes. I'm right there with you in spirit. We'll be together soon."; break;
        case 'mad': title = "When You're Mad"; msg = "Take a deep breath. I love you even when you're frustrated. Let's talk it out when you're ready."; break;
        default: title = "Open When..."; msg = "I love you.";
    }
    customAlert(title, msg);
};

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
    createScatteredGallery(); // init scattered photos

    document.querySelector('.custom-alert-overlay').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.custom-alert-overlay')) closeAlert();
    });

    document.querySelector('.photo-modal-overlay').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.photo-modal-overlay')) closePhotoModal();
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

/* --- SCATTERED GALLERY LOGIC --- */
function createScatteredGallery() {
    const container = document.querySelector('.scatter-gallery');
    if (!container) return;
    container.innerHTML = '';

    const photos = [
        { src: 'photo1_1770195667147.png', caption: "Our first adventure" },
        { src: 'photo2_1770195682768.png', caption: "Just us" },
        { src: 'photo3_1770195698920.png', caption: "My favorite view" },
        { src: 'photo1_1770195667147.png', caption: "You are magic" },
        { src: 'photo1_1770195667147.png', caption: "Our first adventure" },
        { src: 'photo2_1770195682768.png', caption: "Just us" },
        { src: 'photo3_1770195698920.png', caption: "My favorite view" },
        { src: 'photo1_1770195667147.png', caption: "You are magic" },
        { src: 'photo1_1770195667147.png', caption: "Our first adventure" },
        { src: 'photo2_1770195682768.png', caption: "Just us" },
        { src: 'photo3_1770195698920.png', caption: "My favorite view" },
        { src: 'photo1_1770195667147.png', caption: "You are magic" },
        { src: 'photo1_1770195667147.png', caption: "Our first adventure" },
        { src: 'photo2_1770195682768.png', caption: "Just us" },
        { src: 'photo3_1770195698920.png', caption: "My favorite view" },
        { src: 'photo1_1770195667147.png', caption: "You are magic" },
        { src: 'photo1_1770195667147.png', caption: "Our first adventure" },
        { src: 'photo2_1770195682768.png', caption: "Just us" },
        { src: 'photo3_1770195698920.png', caption: "My favorite view" },
        { src: 'photo1_1770195667147.png', caption: "You are magic" },
        { src: 'photo1_1770195667147.png', caption: "Our first adventure" },
        { src: 'photo2_1770195682768.png', caption: "Just us" },
        { src: 'photo3_1770195698920.png', caption: "My favorite view" },
        { src: 'photo1_1770195667147.png', caption: "You are magic" },
        { src: 'photo2_1770195682768.png', caption: "Forever & Always" }
    ];

    // We need to place them so they don't overlap too badly, or just purely random. User asked for "scatter randomly".
    // Let's use constrained random to ensure they are somewhat spread out.
    // Or just pure random with limits.

    photos.forEach((photo, i) => {
        const item = document.createElement('div');
        item.className = 'scatter-photo';

        // Random Position (keep inside 80% width/height to avoid cutoff)
        const left = Math.random() * 70 + 10; // 10% to 80%
        const top = Math.random() * 70 + 10; // 10% to 80%

        // Random Animation Delay so they don't beat in sync
        const delay = Math.random() * 2; // 0-2s delay

        item.style.left = left + '%';
        item.style.top = top + '%';
        item.style.animationDelay = delay + 's';

        item.innerHTML = `<img src="${photo.src}" alt="Memory">`;

        item.onclick = () => showPhotoModal(photo.src, photo.caption);

        container.appendChild(item);
    });
}


/* --- Timer --- */
const startDate = new Date(2025, 6, 27);
function updateTimer() {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    if (document.getElementById('days')) {
        document.getElementById('days').textContent = Math.abs(days);
        document.getElementById('hours').textContent = Math.abs(hours);
        document.getElementById('minutes').textContent = Math.abs(minutes);
        document.getElementById('seconds').textContent = Math.abs(seconds);
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
    "You are smart.", "You are funny.", "You are important.", "You are special.",
    "You are resilient.", "You are confident.", "You are creative.", "You are powerful.",
    "You are patient.", "You are gentle.", "You are honest.", "You are thoughtful.",
    "You are inspiring.", "You are valued.", "You are growing.", "You are improving.",
    "You are learning.", "You are evolving.", "You are becoming your best self.",
    "You are allowed to grow.", "You are allowed to rest.", "You are allowed to change.",
    "You are calm.", "You are grounded.", "You are safe.", "You are supported.",
    "You are not alone.", "You are understood.", "You are accepted.", "You are deserving of love."
];
let affIndex = 0;
window.nextAffirmation = function () {
    affIndex = (affIndex + 1) % affirmations.length;
    document.getElementById('aff-text').textContent = affirmations[affIndex];
}
