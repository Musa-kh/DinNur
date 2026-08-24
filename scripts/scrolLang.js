const container = document.querySelector('.lang-dropdown-container');
const toggleBtn = document.querySelector('.lang-dropdown-toggle');
const currentLangText = document.querySelector('.current-lang');
const options = document.querySelectorAll('.lang-option');

// Объект для кэширования загруженных переводов
const translationsCache = {};
window.translationsCache = translationsCache;

function getLangCode(lang) {
    const codeMap = {
        ru: 'RU',
        kz: 'KZ',
        turkey: 'TR',
        tr: 'TR'
    };
    return codeMap[lang] || (lang ? lang.toUpperCase() : 'RU');
}

function updateLanguageVideos(lang) {
    document.querySelectorAll('[data-default-video]').forEach(video => {
        const defaultVideo = video.getAttribute('data-default-video');
        const turkeyVideo = video.getAttribute('data-turkey-video');
        const nextVideo = lang === 'turkey' && turkeyVideo ? turkeyVideo : defaultVideo;
        const source = video.querySelector('source');

        if (!nextVideo || !source || source.getAttribute('src') === nextVideo) return;

        source.setAttribute('src', nextVideo);
        video.load();
    });
}

/**
 * Функция для смены языка
 * @param {string} lang - код языка (ru, kz)
 */
async function changeLanguage(lang) {
    if (!lang) return;
    
    // 1. Проверяем, загружен ли уже этот язык, если нет — скачиваем
    if (!translationsCache[lang]) {
        try {
            const response = await fetch(`./languages/${lang}.json`); 
            if (!response.ok) {
                throw new Error(`Ошибка загрузки файла: ${response.status} ${response.statusText}`);
            }
            translationsCache[lang] = await response.json();
        } catch (error) {
            console.error(`Не удалось загрузить перевод для "${lang}":`, error);
            return; // Прекращаем выполнение, если файл не найден
        }
    }

    const data = translationsCache[lang];

    // 2. Ищем все элементы с атрибутом data-key и меняем их текст или атрибуты
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (data[key]) {
            if (element.tagName === 'IMG') {
                element.src = data[key];
            } else {
                element.innerHTML = data[key];
            }
        }
    });

    updateLanguageVideos(lang);
}

function ensureLanguageMenuVisible() {
    if (!container || !container.classList.contains('open')) return;

    const mobileMenu = document.querySelector('.mobileMenu');
    const menu = container.querySelector('.lang-dropdown-menu');

    if (!mobileMenu || !menu) return;

    const menuRect = menu.getBoundingClientRect();
    const panelRect = mobileMenu.getBoundingClientRect();

    if (menuRect.bottom > panelRect.bottom) {
        const delta = menuRect.bottom - panelRect.bottom + 8;
        mobileMenu.scrollBy({ top: delta, behavior: 'smooth' });
    } else if (menuRect.top < panelRect.top) {
        const delta = panelRect.top - menuRect.top + 8;
        mobileMenu.scrollBy({ top: -delta, behavior: 'smooth' });
    }
}

// 1. Открытие/закрытие меню при клике на основную кнопку
if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Чтобы клик не всплывал к document
        const willOpen = !container.classList.contains('open');

        // Close country dropdown if open
        document.querySelectorAll('.country-dropdown-container.open').forEach((countryBox) => {
            countryBox.classList.remove('open');
        });

        container.classList.toggle('open', willOpen);

        if (willOpen) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => ensureLanguageMenuVisible());
            });
        }
    });
}

// 2. Обработка выбора языка
if (options) {
    options.forEach(option => {
        option.addEventListener('click', () => {
            const selectedLang = option.getAttribute('data-lang'); // Получаем код (ru, kz)
            
            localStorage.setItem('selectedLanguage', selectedLang);

            // Обновляем текст в кнопке
            if (currentLangText) currentLangText.textContent = getLangCode(selectedLang);
            
            // Вызываем функцию смены языка
            changeLanguage(selectedLang);
            
            // Закрываем меню
            if (container) container.classList.remove('open');
        });
    });
}

// Устанавливаем язык по умолчанию при загрузке страницы
const savedLanguage = localStorage.getItem('selectedLanguage') || 'ru';
if (currentLangText) currentLangText.textContent = getLangCode(savedLanguage);
changeLanguage(savedLanguage);

// 3. Закрытие меню при клике в любом другом месте экрана
document.addEventListener('click', () => {
    if (container) container.classList.remove('open');
});

// --- Slider Logic ---
// Находим элементы слайдера
const slides = document.querySelectorAll('.imageHeaderSlide');
const dots = document.querySelectorAll('.imageHeaderDot');
const prevBtn = document.querySelector('.imageHeaderPrev');
const nextBtn = document.querySelector('.imageHeaderNext');
const header = document.querySelector('header');
const themeClasses = ['theme-new', 'theme-classic', 'theme-luxury'];
let currentIndex = 0;
let slideInterval;

/**
 * Функция обновления активного слайда, точки и темы хедера
 * @param {number} index - индекс нового слайда
 */
function updateSlider(index) {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    
    if (header) {
        header.classList.remove(...themeClasses);
        if (themeClasses[index]) {
            header.classList.add(themeClasses[index]);
        }
    }

    currentIndex = index;
}

function nextSlide() {
    const newIndex = (currentIndex + 1) % slides.length;
    updateSlider(newIndex);
}

function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 3000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

// Кнопки навигации
if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    startAutoSlide(); // Сбрасываем таймер при ручном переключении
});

if (prevBtn) prevBtn.addEventListener('click', () => {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider(newIndex);
    startAutoSlide();
});

// Клик по точкам
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        updateSlider(index);
        startAutoSlide();
    });
});

// Запуск автопрокрутки, если слайды существуют
if (slides.length > 0) {
    updateSlider(0); // Устанавливаем начальную тему
    startAutoSlide();
}
