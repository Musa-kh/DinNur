document.addEventListener('DOMContentLoaded', () => {
    // 1. Находим необходимые элементы
    const langContainer = document.querySelector('.lang-dropdown-container');
    const desktopParent = document.querySelector('.head');
    const menuBtn = document.querySelector('.menuBTN');
    
    // ВАЖНО: Убедитесь, что у вашего мобильного меню есть класс 'mobileMenu'
    // Если вы используете другой класс или ID, замените его здесь
    const mobileMenu = document.querySelector('.mobileMenu');

    // 2. Создаем медиа-запрос для отслеживания ширины экрана
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    function handleTabletChange(e) {
        if (e.matches) {
            // Экран 768px или меньше: перемещаем в мобильное меню
            if (mobileMenu && langContainer) {
                mobileMenu.appendChild(langContainer);
            }
        } else {
            // Экран больше 768px: возвращаем обратно в десктопную шапку
            // Используем insertBefore, чтобы вставить блок перед кнопкой меню
            if (desktopParent && langContainer) {
                desktopParent.insertBefore(langContainer, menuBtn);
            }
        }
    }

    // 3. Подписываемся на изменения
    mediaQuery.addEventListener('change', handleTabletChange);

    // 4. Вызываем один раз при загрузке, чтобы проверить текущий размер экрана
    handleTabletChange(mediaQuery);
});
