// Übersetzungen für alle unterstützten Sprachen
const translations = {
    en: {
        'page-title': 'SpinSelector - Let faith decide!',
        'subtitle': 'Let faith decide!',
        'btn-spin': 'SPIN',
        'heading-add-options': 'Add Options',
        'input-placeholder': 'Enter new option...',
        'btn-add': 'Add',
        'heading-actions': 'Actions',
        'btn-shuffle': 'Shuffle',
        'btn-clear': 'Clear All',
        'checkbox-auto-remove': 'Auto-remove after spin',
        'heading-options': 'Options',
        'footer-imprint': 'Imprint',
        'footer-privacy': 'Privacy',
        'empty-state': 'No options available.<br>Add at least 2 options!',
        'canvas-empty': 'Add options',
        'result-prefix': '🎉 ',
        'confirm-clear': 'Do you really want to delete all options?',
        'default-options': ['Pizza', 'Burger', 'Pasta', 'Sushi', 'Salad', 'Steak']
    },
    de: {
        'page-title': 'SpinSelector - Lass das Schicksal entscheiden!',
        'subtitle': 'Lass das Schicksal entscheiden!',
        'btn-spin': 'DREHEN',
        'heading-add-options': 'Optionen hinzufügen',
        'input-placeholder': 'Neue Option eingeben...',
        'btn-add': 'Hinzufügen',
        'heading-actions': 'Aktionen',
        'btn-shuffle': 'Mischen',
        'btn-clear': 'Alle löschen',
        'checkbox-auto-remove': 'Automatisch entfernen nach Drehen',
        'heading-options': 'Optionen',
        'footer-imprint': 'Impressum',
        'footer-privacy': 'Datenschutz',
        'empty-state': 'Keine Optionen vorhanden.<br>Füge mindestens 2 Optionen hinzu!',
        'canvas-empty': 'Füge Optionen hinzu',
        'result-prefix': '🎉 ',
        'confirm-clear': 'Möchtest du wirklich alle Optionen löschen?',
        'default-options': ['Pizza', 'Burger', 'Pasta', 'Sushi', 'Salat', 'Steak']
    },
    fr: {
        'page-title': 'SpinSelector - Laissez le destin décider!',
        'subtitle': 'Laissez le destin décider!',
        'btn-spin': 'TOURNER',
        'heading-add-options': 'Ajouter des options',
        'input-placeholder': 'Entrez une nouvelle option...',
        'btn-add': 'Ajouter',
        'heading-actions': 'Actions',
        'btn-shuffle': 'Mélanger',
        'btn-clear': 'Tout effacer',
        'checkbox-auto-remove': 'Supprimer automatiquement après le tour',
        'heading-options': 'Options',
        'footer-imprint': 'Mentions légales',
        'footer-privacy': 'Confidentialité',
        'empty-state': 'Aucune option disponible.<br>Ajoutez au moins 2 options!',
        'canvas-empty': 'Ajoutez des options',
        'result-prefix': '🎉 ',
        'confirm-clear': 'Voulez-vous vraiment supprimer toutes les options?',
        'default-options': ['Pizza', 'Burger', 'Pâtes', 'Sushi', 'Salade', 'Steak']
    },
    es: {
        'page-title': 'SpinSelector - ¡Deja que el destino decida!',
        'subtitle': '¡Deja que el destino decida!',
        'btn-spin': 'GIRAR',
        'heading-add-options': 'Añadir opciones',
        'input-placeholder': 'Ingrese nueva opción...',
        'btn-add': 'Añadir',
        'heading-actions': 'Acciones',
        'btn-shuffle': 'Mezclar',
        'btn-clear': 'Borrar todo',
        'checkbox-auto-remove': 'Eliminar automáticamente después de girar',
        'heading-options': 'Opciones',
        'footer-imprint': 'Aviso legal',
        'footer-privacy': 'Privacidad',
        'empty-state': 'No hay opciones disponibles.<br>¡Añade al menos 2 opciones!',
        'canvas-empty': 'Añade opciones',
        'result-prefix': '🎉 ',
        'confirm-clear': '¿Realmente quieres eliminar todas las opciones?',
        'default-options': ['Pizza', 'Hamburguesa', 'Pasta', 'Sushi', 'Ensalada', 'Bistec']
    }
};

// Aktuelle Sprache
let currentLanguage = 'en';

// Sprache initialisieren
function initLanguage() {
    const saved = localStorage.getItem('language');
    if (saved && translations[saved]) {
        currentLanguage = saved;
    } else {
        // Browser-Sprache erkennen
        const browserLang = navigator.language.slice(0, 2);
        currentLanguage = translations[browserLang] ? browserLang : 'en';
    }
    updateLanguage();
}

// Sprache wechseln
function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateLanguage();
}

// UI mit aktueller Sprache aktualisieren
function updateLanguage() {
    const t = translations[currentLanguage];
    
    // Dokument-Titel
    document.title = t['page-title'];
    document.documentElement.lang = currentLanguage;
    
    // Alle Elemente mit data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });
    
    // Placeholder für Input
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
    
    // Sprachauswahl-Button aktualisieren
    const langCodes = {
        'en': 'EN',
        'de': 'DE',
        'fr': 'FR',
        'es': 'ES'
    };
    
    const currentLangEl = document.getElementById('currentLang');
    if (currentLangEl) {
        currentLangEl.textContent = langCodes[currentLanguage] || 'EN';
    }
    
    // Trigger custom event für andere Komponenten
    window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: currentLanguage, translations: t } 
    }));
}

// Übersetzung abrufen
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Export für andere Module
window.i18n = {
    t,
    currentLanguage: () => currentLanguage,
    setLanguage,
    initLanguage
};