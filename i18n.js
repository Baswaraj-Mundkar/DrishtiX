const i18nConfig = {
    defaultLanguage: 'en',
    storageKey: 'app_language',
    supportedLanguages: ['en', 'hi', 'mr', 'ta', 'te', 'kn', 'gu', 'bn']
};

let translations = {};

async function loadTranslations(lang) {
    try {
        console.log(`i18n: Fetching locales/${lang}.json...`);
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
        const data = await response.json();
        translations = data;
        window.i18n.locales[lang] = data;
        window.i18n.currentLang = lang;
        console.log(`i18n: Successfully loaded ${lang}.json`);
        return true;
    } catch (error) {
        console.error(`i18n Error loading ${lang}:`, error);
        // Ensure we always have at least empty object to avoid crashes
        if (!window.i18n.locales[lang]) window.i18n.locales[lang] = {};
        return false;
    }
}

function applyTranslations() {
    try {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            try {
                const key = el.getAttribute('data-i18n');
                const translation = window.i18n.t(key);
                
                if (translation !== key) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = translation;
                    } else if (translation.includes('<') && translation.includes('>')) {
                        el.innerHTML = translation;
                    } else {
                        el.textContent = translation;
                    }
                }
            } catch (elError) {
                console.warn(`i18n: Failed to translate element`, el, elError);
            }
        });
    } catch (globalError) {
        console.error("i18n Global Apply Error:", globalError);
    }

    const switcher = document.getElementById('lang-switcher');
    if (switcher) switcher.value = window.i18n.currentLang;
    
    document.documentElement.lang = window.i18n.currentLang;
    
    // Help other scripts react to language change
    document.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { lang: window.i18n.currentLang } 
    }));
}

async function initI18n() {
    // Always load English for fallback translations
    await loadTranslations(window.i18n.currentLang || 'en');
    
    let savedLang = localStorage.getItem(i18nConfig.storageKey);
    if (savedLang && savedLang !== 'en' && i18nConfig.supportedLanguages.includes(savedLang)) {
        await loadTranslations(savedLang);
    }
    
    window.i18n.isReady = true;
    applyTranslations();
}

async function switchLanguage(lang) {
    if (i18nConfig.supportedLanguages.includes(lang)) {
        localStorage.setItem(i18nConfig.storageKey, lang);
        const success = await loadTranslations(lang);
        if (success) applyTranslations();
    }
}

window.i18n = {
    currentLang: 'en',
    locales: {},
    isReady: false,
    t: function(key, params = {}) {
        let translation = key;
        try {
            if (translations && translations[key]) {
                translation = translations[key];
            } else if (this.locales['en'] && this.locales['en'][key]) {
                translation = this.locales['en'][key];
            }

            if (typeof translation !== 'string') {
                translation = String(translation || key);
            }

            // Replace placeholders like {name}
            Object.keys(params).forEach(param => {
                translation = translation.replace(new RegExp(`{${param}}`, 'g'), params[param]);
            });
        } catch (e) {
            console.warn(`i18n.t error for key "${key}":`, e);
        }
        return translation;
    },
    switchLanguage: switchLanguage,
    init: initI18n
};

document.addEventListener('DOMContentLoaded', () => {
    window.i18n.init();
    const switcher = document.getElementById('lang-switcher');
    if (switcher) {
        switcher.addEventListener('change', (e) => window.i18n.switchLanguage(e.target.value));
    }
});
