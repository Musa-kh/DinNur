const container = document.querySelector('.lang-dropdown-container');
const toggleBtn = document.querySelector('.lang-dropdown-toggle');
const currentLangText = document.querySelector('.current-lang');
const options = document.querySelectorAll('.lang-option');

// Объект для кэширования загруженных переводов
const translationsCache = {};

/**
 * Функция для смены языка
 * @param {string} lang - код языка (ru, kz, en)
 */
async function changeLanguage(lang) {
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

    // 2. Ищем все элементы с атрибутом data-key и меняем их текст
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (data[key]) {
            element.textContent = data[key];
        }
    });
}

// 1. Открытие/закрытие меню при клике на основную кнопку
toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Чтобы клик не всплывал к document
    container.classList.toggle('open');
});

// 2. Обработка выбора языка
options.forEach(option => {
    option.addEventListener('click', () => {
        const selectedLang = option.getAttribute('data-lang'); // Получаем код (ru, kz, en)
        
        // Обновляем текст в кнопке
        currentLangText.textContent = selectedLang.toUpperCase();
        
        // Вызываем функцию смены языка
        changeLanguage(selectedLang);
        
        // Закрываем меню
        container.classList.remove('open');
    });
});

// Устанавливаем язык по умолчанию при загрузке страницы
changeLanguage('ru');

// 3. Закрытие меню при клике в любом другом месте экрана
document.addEventListener('click', () => {
    container.classList.remove('open');
});