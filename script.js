// Globale Variablen
let options = [];
let isSpinning = false;
let currentRotation = 0;
let animationFrameId = null;
let lastDrawnRotation = -1;

// DOM Elemente
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d', { alpha: false });
const spinBtn = document.getElementById('spinBtn');
const addBtn = document.getElementById('addBtn');
const optionInput = document.getElementById('optionInput');
const optionsList = document.getElementById('optionsList');
const optionCount = document.getElementById('optionCount');
const shuffleBtn = document.getElementById('shuffleBtn');
const clearBtn = document.getElementById('clearBtn');
const autoRemove = document.getElementById('autoRemove');
const resultDisplay = document.getElementById('resultDisplay');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const langDropdown = document.getElementById('langDropdown');

// Theme Verwaltung
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    drawWheel();
});

// Sprach-Dropdown
langToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('hidden');
});

// Sprache wechseln
document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        window.i18n.setLanguage(lang);
        langDropdown.classList.add('hidden');
    });
});

// Dropdown schließen beim Klick außerhalb
document.addEventListener('click', (e) => {
    if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.classList.add('hidden');
    }
});

// Farben für die Segmente
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#FF8B94', '#A8DADC', '#E76F51', '#2A9D8F', '#E9C46A',
    '#F4A261', '#8E7CC3', '#6A994E', '#BC4749', '#457B9D'
];

// Option hinzufügen
function addOption(text) {
    if (!text || text.trim() === '') return;
    
    const option = {
        text: text.trim(),
        color: colors[options.length % colors.length],
        id: Date.now()
    };
    
    options.push(option);
    updateUI();
    saveToLocalStorage();
}

// Option entfernen
function removeOption(id) {
    if (isSpinning) return;
    
    options = options.filter(opt => opt.id !== id);
    lastDrawnRotation = -1;
    updateUI();
    saveToLocalStorage();
}

// UI aktualisieren
function updateUI() {
    drawWheel();
    renderOptionsList();
    optionCount.textContent = options.length;
    spinBtn.disabled = options.length < 2;
}

// Optionsliste rendern
function renderOptionsList() {
    if (options.length === 0) {
        optionsList.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>${window.i18n.t('empty-state')}</p>
            </div>
        `;
        return;
    }
    
    optionsList.innerHTML = options.map(option => `
        <div class="option-item">
            <div style="display: flex; align-items: center; flex: 1;">
                <div class="option-color" style="background-color: ${option.color};"></div>
                <span class="option-text">${escapeHtml(option.text)}</span>
            </div>
            <button class="delete-btn" onclick="removeOption(${option.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
}

// HTML Escape für XSS Schutz
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Rad zeichnen (MAXIMAL OPTIMIERT)
function drawWheel() {
    if (lastDrawnRotation === currentRotation && options.length > 0 && !isSpinning) return;
    lastDrawnRotation = currentRotation;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (options.length === 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        const theme = document.documentElement.getAttribute('data-theme');
        ctx.fillStyle = theme === 'dark' ? '#334155' : '#e2e8f0';
        ctx.fill();
        ctx.strokeStyle = theme === 'dark' ? '#475569' : '#cbd5e1';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.fillStyle = theme === 'dark' ? '#94a3b8' : '#64748b';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(window.i18n.t('canvas-empty'), centerX, centerY);
        return;
    }
    
    const anglePerSegment = (2 * Math.PI) / options.length;
    
    ctx.save();
    
    // Alle Segmente zeichnen
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const startAngle = currentRotation + (i * anglePerSegment);
        const endAngle = startAngle + anglePerSegment;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = option.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    // Alle Texte zeichnen
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const startAngle = currentRotation + (i * anglePerSegment);
        const midAngle = startAngle + anglePerSegment / 2;
        
        const textX = centerX + Math.cos(midAngle) * radius * 0.65;
        const textY = centerY + Math.sin(midAngle) * radius * 0.65;
        
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(midAngle + Math.PI / 2);
        
        const text = option.text.length > 20 ? option.text.substring(0, 20) + '...' : option.text;
        ctx.fillText(text, 0, 0);
        ctx.restore();
    }
    
    // Äußerer Rand
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.stroke();
    
    ctx.restore();
}

// Rad drehen
function spinWheel() {
    if (isSpinning || options.length < 2) return;
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    isSpinning = true;
    spinBtn.disabled = true;
    resultDisplay.textContent = '';
    resultDisplay.classList.remove('show');
    
    const spinDuration = 3500;
    const minRotations = 5;
    const maxRotations = 7;
    const rotations = minRotations + Math.random() * (maxRotations - minRotations);
    const totalRotation = rotations * 2 * Math.PI;
    
    const startTime = performance.now();
    const startRotation = currentRotation;
    
    let lastUpdateTime = startTime;
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;
    
    function animate(currentTime) {
        const timeSinceLastUpdate = currentTime - lastUpdateTime;
        
        if (timeSinceLastUpdate < frameTime) {
            animationFrameId = requestAnimationFrame(animate);
            return;
        }
        
        lastUpdateTime = currentTime - (timeSinceLastUpdate % frameTime);
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3.5);
        currentRotation = startRotation + totalRotation * easeOut;
        
        drawWheel();
        
        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            animationFrameId = null;
            finishSpin();
        }
    }
    
    animationFrameId = requestAnimationFrame(animate);
}

// Gewinner ermitteln
function finishSpin() {
    isSpinning = false;
    spinBtn.disabled = false;
    
    const normalizedRotation = ((currentRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    const anglePerSegment = (2 * Math.PI) / options.length;
    let pointerAngle = (2 * Math.PI - normalizedRotation) % (2 * Math.PI);
    let winningIndex = Math.floor(pointerAngle / anglePerSegment);
    winningIndex = winningIndex % options.length;
    
    if (winningIndex < 0 || winningIndex >= options.length) {
        winningIndex = 0;
    }
    
    const winner = options[winningIndex];
    
    // Ergebnis anzeigen
    resultDisplay.textContent = `${window.i18n.t('result-prefix')}${winner.text}`;
    resultDisplay.style.background = winner.color;
    resultDisplay.style.color = '#ffffff';
    resultDisplay.classList.add('show');
    
    // Auto-Remove
    if (autoRemove.checked && winner && winner.id) {
        setTimeout(() => {
            const stillExists = options.find(opt => opt.id === winner.id);
            if (stillExists) {
                const wasSpinning = isSpinning;
                isSpinning = false;
                removeOption(winner.id);
                isSpinning = wasSpinning;
            }
        }, 2000);
    }
}

// Optionen mischen
function shuffleOptions() {
    if (isSpinning) return;
    
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    lastDrawnRotation = -1;
    updateUI();
    saveToLocalStorage();
}

// Alle Optionen löschen
function clearAllOptions() {
    if (isSpinning) return;
    
    if (options.length > 0 && !confirm(window.i18n.t('confirm-clear'))) {
        return;
    }
    
    options = [];
    currentRotation = 0;
    lastDrawnRotation = -1;
    resultDisplay.textContent = '';
    resultDisplay.classList.remove('show');
    updateUI();
    saveToLocalStorage();
}

// LocalStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('wheelOptions', JSON.stringify(options));
    } catch (e) {
        console.error('Fehler beim Speichern:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('wheelOptions');
        if (saved) {
            options = JSON.parse(saved);
            updateUI();
        }
    } catch (e) {
        console.error('Fehler beim Laden der Daten:', e);
        options = [];
    }
}

// Event Listeners
spinBtn.addEventListener('click', spinWheel);

addBtn.addEventListener('click', () => {
    const value = optionInput.value;
    if (value) {
        addOption(value);
        optionInput.value = '';
        optionInput.focus();
    }
});

optionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const value = optionInput.value;
        if (value) {
            addOption(value);
            optionInput.value = '';
        }
    }
});

shuffleBtn.addEventListener('click', shuffleOptions);
clearBtn.addEventListener('click', clearAllOptions);

// Sprache geändert - UI aktualisieren
window.addEventListener('languageChanged', () => {
    updateUI();
    drawWheel();
});

// Cleanup
window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        isSpinning = false;
        spinBtn.disabled = false;
    }
});

window.addEventListener('pagehide', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
});

// Initialisierung
initTheme();
window.i18n.initLanguage();
loadFromLocalStorage();

// Standardoptionen wenn leer
if (options.length === 0) {
    const defaultOptions = window.i18n.t('default-options');
    defaultOptions.forEach(option => {
        addOption(option);
    });
}

updateUI();