document.addEventListener('DOMContentLoaded', () => {
    const headerSlider = document.querySelector('.imageHeaderSlider');
    if (headerSlider) {
        const slides = Array.from(headerSlider.querySelectorAll('.imageHeaderSlide'));
        const dots = Array.from(headerSlider.querySelectorAll('.imageHeaderDot'));
        const prev = headerSlider.querySelector('.imageHeaderPrev');
        const next = headerSlider.querySelector('.imageHeaderNext');
        const header = document.querySelector('header');
        const themeClasses = ['theme-new', 'theme-classic', 'theme-luxury'];
        let currentIndex = 0;
        let timerId;

        function showSlide(index) {
            currentIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('active', slideIndex === currentIndex);
            });

            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('active', dotIndex === currentIndex);
                dot.setAttribute('aria-current', dotIndex === currentIndex ? 'true' : 'false');
            });

            if (header) {
                header.classList.remove(...themeClasses);
                header.classList.add(themeClasses[currentIndex]);
            }
        }

        function startAutoPlay() {
            stopAutoPlay();
            timerId = window.setInterval(() => showSlide(currentIndex + 1), 3800);
        }

        function stopAutoPlay() {
            if (timerId) {
                window.clearInterval(timerId);
                timerId = null;
            }
        }

        prev?.addEventListener('click', () => {
            showSlide(currentIndex - 1);
            startAutoPlay();
        });

        next?.addEventListener('click', () => {
            showSlide(currentIndex + 1);
            startAutoPlay();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startAutoPlay();
            });
        });

        headerSlider.addEventListener('mouseenter', stopAutoPlay);
        headerSlider.addEventListener('mouseleave', startAutoPlay);
        headerSlider.addEventListener('focusin', stopAutoPlay);
        headerSlider.addEventListener('focusout', startAutoPlay);

        showSlide(0);
        startAutoPlay();
    }

    const slider = document.querySelector('.collectionSlider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.collectionSlide'));
    const dots = Array.from(slider.querySelectorAll('.collectionDot'));
    const prev = slider.querySelector('.collectionPrev');
    const next = slider.querySelector('.collectionNext');
    let currentIndex = 0;
    let timerId;

    function showSlide(index) {
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('active', slideIndex === currentIndex);
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === currentIndex);
        });
    }

    function startAutoPlay() {
        stopAutoPlay();
        timerId = window.setInterval(() => showSlide(currentIndex + 1), 4200);
    }

    function stopAutoPlay() {
        if (timerId) {
            window.clearInterval(timerId);
            timerId = null;
        }
    }

    prev?.addEventListener('click', () => {
        showSlide(currentIndex - 1);
        startAutoPlay();
    });

    next?.addEventListener('click', () => {
        showSlide(currentIndex + 1);
        startAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoPlay();
        });
    });

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    slider.addEventListener('focusin', stopAutoPlay);
    slider.addEventListener('focusout', startAutoPlay);

    showSlide(0);
    startAutoPlay();
});
