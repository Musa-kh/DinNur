document.addEventListener('DOMContentLoaded', () => {
    const langContainer = document.querySelector('.lang-dropdown-container');
    const desktopParent = document.querySelector('.head');
    const menuBtn = document.querySelector('.menuBTN');
    const mobileNav = document.querySelector('.mobileMenu .navigation.num2');

    if (!langContainer || !desktopParent) return;

    const mediaQuery = window.matchMedia('(max-width: 768px)');

    function moveLanguageMenu(isMobile) {
        if (isMobile) {
            if (mobileNav && !mobileNav.contains(langContainer)) {
                mobileNav.appendChild(langContainer);
            }
            return;
        }

        if (desktopParent && !desktopParent.contains(langContainer)) {
            desktopParent.insertBefore(langContainer, menuBtn || null);
        }
    }

    function handleTabletChange(e) {
        moveLanguageMenu(e.matches);
    }

    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleTabletChange);
    } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleTabletChange);
    }

    handleTabletChange(mediaQuery);
});
