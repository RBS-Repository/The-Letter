/* --- LOADER LOGIC --- */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            // Start music auto-attempt after load
            const audio = document.getElementById('bg-music');
            if (audio) audio.play().then(() => updateVinyl(true)).catch(() => updateVinyl(false));
        }, 1000); // 1s delay for dramatic effect
    }
});
// Fallback if load hangs
setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader && loader.style.opacity !== '0') {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }
}, 5000);


/* --- AUDIO LOGIC --- */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClickSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

document.addEventListener('click', () => {
    // playClickSound(); 
});


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
        case 'miss': title = "When You Need  Me"; msg = "No matter the reason, I’m here. Always."; break;
        case 'mad': title = "When You're Mad"; msg = "Take a deep breath. I love you even when you're frustrated. Let's talk it out when you're ready."; break;
        default: title = "Open When..."; msg = "I love you.";
    }
    customAlert(title, msg);
};

document.addEventListener('DOMContentLoaded', () => {
    /* Background Music handled in window.load for cleaner start */
    const audio = document.getElementById('bg-music');
    // Fallback interaction listener
    const playOnInteraction = () => {
        playClickSound(); // Also trigger beep
        audio.play().then(() => {
            updateVinyl(true);
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
        }).catch(err => { });
    };
    document.addEventListener('click', playOnInteraction);
    document.addEventListener('touchstart', playOnInteraction);

    observeFinale();
    setupKeyGame();
    createScatteredGallery();
    observeTypewriter();

    document.querySelector('.custom-alert-overlay').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.custom-alert-overlay')) closeAlert();
    });

    document.querySelector('.photo-modal-overlay').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.photo-modal-overlay')) closePhotoModal();
    });
});

/* --- Vinyl Player Logic --- */
window.toggleMusic = function () {
    const audio = document.getElementById('bg-music');
    if (audio.paused) {
        audio.play().then(() => updateVinyl(true));
    } else {
        audio.pause();
        updateVinyl(false);
    }
}

function updateVinyl(isPlaying) {
    const record = document.querySelector('.record');
    const arm = document.querySelector('.tonearm');
    const btn = document.getElementById('play-btn');

    if (isPlaying) {
        if (record) record.classList.add('playing');
        if (arm) arm.classList.add('playing');
        if (btn) btn.textContent = "Pause Music ⏸️";
    } else {
        if (record) record.classList.remove('playing');
        if (arm) arm.classList.remove('playing');
        if (btn) btn.textContent = "Play Our Song ▶️";
    }
}

/* --- Typewriter Logic --- */
const poemText = `My dearest,\n\nIn a world of constant change, you are my steady ground.\nEvery moment with you feels like a beautiful dream I never want to wake up from.\n\nI love you, now and forever.`;
let typeIdx = 0;
let isTyping = false;

function observeTypewriter() {
    const section = document.querySelector('.typewriter-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isTyping) {
                isTyping = true;
                typeWriter();
            }
        });
    }, { threshold: 0.5 });
    if (section) observer.observe(section);
}

function typeWriter() {
    if (typeIdx < poemText.length) {
        const textEl = document.querySelector('.typewriter-text');
        textEl.textContent += poemText.charAt(typeIdx);
        typeIdx++;
        setTimeout(typeWriter, 50); // Typing speed
    }
}

/* --- Build a Bouquet Logic --- */
window.addToBouquet = function (flower) {
    const container = document.querySelector('.cloud-bouquet');
    const el = document.createElement('div');
    el.classList.add('bouquet-item');
    el.textContent = flower;
    el.style.transform = `rotate(${Math.random() * 20 - 10}deg)`; // Random tilt
    container.appendChild(el);
    playClickSound();
}
window.resetBouquet = function () {
    document.querySelector('.cloud-bouquet').innerHTML = '';
}

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

/* --- SCATTERED GALLERY LOGIC (Refined Drag) --- */
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
        { src: 'photo2_1770195682768.png', caption: "Forever & Always" }
    ];

    photos.forEach((photo, i) => {
        const item = document.createElement('div');
        item.className = 'scatter-photo';
        const left = Math.random() * 80 + 5;
        const top = Math.random() * 80 + 10;
        const duration = Math.random() * 7 + 8;
        const delay = Math.random() * 5;

        item.style.left = left + '%';
        item.style.top = top + '%';
        item.style.animationDuration = duration + 's';
        item.style.animationDelay = delay + 's';

        item.innerHTML = `<img src="${photo.src}" alt="Memory">`;
        container.appendChild(item);

        // REFINED DRAG LOGIC
        let isDown = false;
        let startX = 0, startY = 0;
        let offset = [0, 0];
        let hasMoved = false;

        const startDrag = (e) => {
            isDown = true;
            hasMoved = false;

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            startX = clientX;
            startY = clientY;

            offset = [
                item.offsetLeft - clientX,
                item.offsetTop - clientY
            ];

            item.classList.add('dragging'); // Pause spin
        };

        const endDrag = (e) => {
            isDown = false;
            item.classList.remove('dragging');
        };

        const onDrag = (e) => {
            if (!isDown) return;

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            // Calculate distance moved
            const moveX = clientX - startX;
            const moveY = clientY - startY;
            const distance = Math.sqrt(moveX * moveX + moveY * moveY);

            // Threshold: Only consider it a drag if moved > 5 pixels
            if (distance > 5) {
                hasMoved = true;
                e.preventDefault(); // Prevent scroll only if intentional drag

                item.style.left = (clientX + offset[0]) + 'px';
                item.style.top = (clientY + offset[1]) + 'px';
                item.style.transform = 'none';
                item.style.animation = 'none'; // Permanently stop float if moved manually
            }
        };

        const onClick = (e) => {
            // Only open if it wasn't a drag interaction
            if (!hasMoved) {
                showPhotoModal(photo.src, photo.caption);
                playClickSound();
            }
        };

        // Mouse Events
        item.addEventListener('mousedown', startDrag);
        document.addEventListener('mouseup', (e) => { if (isDown) { endDrag(e); } });
        item.addEventListener('mouseup', (e) => { onClick(e); }); // Specific click handler
        document.addEventListener('mousemove', onDrag);

        // Touch Events
        item.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchend', (e) => { if (isDown) { endDrag(e); onClick(e); } });
        document.addEventListener('touchmove', onDrag, { passive: false });
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

/* --- Bottle --- */
const messages = [
    "You are my favorite person.",
    "I love you more than words can say.",
    "Your smile lights up my world.",
    "I want to be with you forever.",

    "You are incredible.",
    "You are loved.",
    "You make the world better.",
    "Your laugh is magic.",

    "You are enough.",
    "You matter more than you realize.",
    "You bring light wherever you go.",
    "You are deeply valued.",
    "You are doing better than you think.",
    "You are worthy of good things.",
    "You are appreciated.",
    "You make people feel seen.",
    "You are a gift.",
    "You are safe to be yourself.",

    "You have a beautiful heart.",
    "You are stronger than yesterday.",
    "You are allowed to take up space.",
    "You make life softer.",
    "You are important.",
    "You are not replaceable.",
    "You bring comfort just by being you.",
    "You are lovable exactly as you are.",
    "You are someone’s favorite person.",
    "You are genuinely special.",

    "You inspire me more than you know.",
    "You are kind in ways that matter.",
    "You make my hard days easier.",
    "You are doing your best and that’s enough.",
    "You are trusted.",
    "You are respected.",
    "You are seen.",
    "You are heard.",
    "You are supported.",
    "You are never too much.",

    "You are allowed to rest.",
    "You are allowed to grow slowly.",
    "You are allowed to feel deeply.",
    "You are allowed to change.",
    "You are human and that’s beautiful.",
    "You have a calming presence.",
    "You make me feel at home.",
    "You are my safe place.",
    "You are gentle and powerful.",
    "You are becoming who you’re meant to be.",

    "You are worthy of love without conditions.",
    "You are worthy even on bad days.",
    "You are not a burden.",
    "You are not alone.",
    "You are a reason I smile.",
    "You are easy to love.",
    "You are allowed to be proud of yourself.",
    "You are growing in the right direction.",
    "You are exactly who I want.",
    "You are everything I didn’t know I needed.",

    "You make my world brighter.",
    "You make my life better just by being in it.",
    "You are unforgettable.",
    "You are more than your mistakes.",
    "You are more than your past.",
    "You are enough without proving anything.",
    "You are allowed to shine.",
    "You are allowed to be soft.",
    "You are allowed to be strong.",
    "You are perfect in your own way.",

    "You are deeply cherished.",
    "You are my comfort.",
    "You are my peace.",
    "You are my happiness.",
    "You are my person.",
    "You are loved more than you know.",
    "You are always on my mind.",
    "You mean everything to me.",
    "You are my favorite feeling.",
    "I’m grateful for you every single day."
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
    "You are worthy.",
    "You are capable.",
    "You are loved.",
    "You are strong.",
    "You are enough.",
    "You are beautiful.",
    "You are brave.",
    "You are radiant.",
    "You are kind.",
    "You are amazing.",
    "You are smart.",
    "You are funny.",
    "You are important.",
    "You are special.",

    "You are resilient.",
    "You are confident.",
    "You are creative.",
    "You are powerful.",
    "You are patient.",
    "You are gentle.",
    "You are honest.",
    "You are thoughtful.",
    "You are inspiring.",
    "You are valued.",

    "You are growing.",
    "You are improving.",
    "You are learning.",
    "You are evolving.",
    "You are becoming your best self.",
    "You are allowed to grow.",
    "You are allowed to rest.",
    "You are allowed to change.",

    "You are calm.",
    "You are grounded.",
    "You are safe.",
    "You are supported.",
    "You are not alone.",
    "You are understood.",
    "You are accepted.",

    "You are deserving of love.",
    "You are deserving of happiness.",
    "You are deserving of peace.",
    "You are deserving of success.",
    "You are deserving of kindness.",

    "You are a good person.",
    "You are doing your best.",
    "You are making progress.",
    "You are on the right path.",
    "You are exactly where you need to be.",

    "You are worthy of respect.",
    "You are worthy of patience.",
    "You are worthy of care.",
    "You are worthy of joy.",

    "You are more than your mistakes.",
    "You are more than your past.",
    "You are not a burden.",
    "You are not too much.",

    "You are loved just as you are.",
    "You are enough just as you are.",
    "You are complete.",
    "You are whole."
];

let affIndex = 0;
window.nextAffirmation = function () {
    affIndex = (affIndex + 1) % affirmations.length;
    document.getElementById('aff-text').textContent = affirmations[affIndex];
}

/* --- ANTI-COPY PROTECTION --- */
document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', function (e) {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
        return false;
    }
});
