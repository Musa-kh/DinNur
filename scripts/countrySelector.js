(function () {
    const storageKey = "selectedCountry";
    const countries = [
        { value: "kazakhstan", label: "Казахстан", key: "country_kz" },
        { value: "turkey", label: "Турция", key: "country_tr" },
        { value: "other", label: "Другая страна", key: "country_other" }
    ];

    function setStoredCountry(country) {
        try {
            localStorage.setItem(storageKey, country);
        } catch (error) {
            window.selectedCountry = country;
        }
    }

    function getStoredCountry() {
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            return window.selectedCountry || "";
        }
    }

    function updateCountryVideos(country) {
        document.querySelectorAll('[data-default-video]').forEach((video) => {
            const defaultVideo = video.getAttribute('data-default-video');
            const turkeyVideo = video.getAttribute('data-turkey-video');
            const nextVideo = country === 'turkey' && turkeyVideo ? turkeyVideo : defaultVideo;
            const source = video.querySelector('source');

            if (!nextVideo || !source || source.getAttribute('src') === nextVideo) return;

            source.setAttribute('src', nextVideo);
            video.load();
        });
    }

    function updateCountryUI(country) {
        const item = countries.find((c) => c.value === country) || countries[0];

        document.querySelectorAll('.current-country').forEach((element) => {
            element.setAttribute('data-key', item.key);

            const activeLang = localStorage.getItem('selectedLanguage') || 'ru';
            if (window.translationsCache && window.translationsCache[activeLang] && window.translationsCache[activeLang][item.key]) {
                element.innerHTML = window.translationsCache[activeLang][item.key];
            } else {
                const opt = document.querySelector(`.country-option[data-country="${item.value}"]`);
                element.innerHTML = opt ? opt.innerHTML : item.label;
            }
        });

        document.querySelectorAll('.country-option').forEach((button) => {
            const optionCountry = button.getAttribute('data-country');
            button.classList.toggle('active', optionCountry === country);
        });
    }

    function applyCountry(country) {
        if (!country) return;

        document.documentElement.setAttribute("data-country", country);
        if (document.body) {
            document.body.setAttribute("data-country", country);
        }

        document.querySelectorAll("[data-country-content]").forEach((element) => {
            const allowedCountries = element
                .getAttribute("data-country-content")
                .split(",")
                .map((item) => item.trim());

            element.hidden = !allowedCountries.includes(country) && !allowedCountries.includes("all");
        });

        updateCountryVideos(country);
        updateCountryUI(country);
    }

    function closeDialog(dialog) {
        dialog.remove();
        document.body.classList.remove("country-dialog-open");
    }

    function createDialog() {
        if (document.querySelector('.country-dialog')) return;

        const overlay = document.createElement("div");
        overlay.className = "country-dialog";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-labelledby", "country-dialog-title");

        const panel = document.createElement("div");
        panel.className = "country-dialog-panel";

        const title = document.createElement("h2");
        title.id = "country-dialog-title";
        title.setAttribute("data-key", "country_modal_title");
        title.textContent = "Выберите вашу страну";

        const text = document.createElement("p");
        text.setAttribute("data-key", "country_modal_text");
        text.textContent = "Мы покажем подходящую информацию для вашего региона.";

        const actions = document.createElement("div");
        actions.className = "country-dialog-actions";

        countries.forEach((country) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "country-dialog-button";
            button.setAttribute("data-key", country.key);
            button.textContent = country.label;
            button.addEventListener("click", () => {
                setStoredCountry(country.value);
                applyCountry(country.value);
                closeDialog(overlay);
            });
            actions.appendChild(button);
        });

        panel.append(title, text, actions);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        document.body.classList.add("country-dialog-open");

        const firstButton = actions.querySelector("button");
        if (firstButton) {
            firstButton.focus();
        }
    }

    function setupDropdowns() {
        document.querySelectorAll('.country-dropdown-toggle').forEach((toggle) => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const container = toggle.closest('.country-dropdown-container');
                if (!container) return;

                const willOpen = !container.classList.contains('open');

                // Close language dropdown if open
                document.querySelectorAll('.lang-dropdown-container.open').forEach((langBox) => {
                    langBox.classList.remove('open');
                });

                document.querySelectorAll('.country-dropdown-container.open').forEach((box) => {
                    if (box !== container) box.classList.remove('open');
                });

                container.classList.toggle('open', willOpen);
            });
        });

        document.querySelectorAll('.country-option').forEach((option) => {
            option.addEventListener('click', () => {
                const selectedCountry = option.getAttribute('data-country');
                if (!selectedCountry) return;

                setStoredCountry(selectedCountry);
                applyCountry(selectedCountry);

                document.querySelectorAll('.country-dropdown-container.open').forEach((container) => {
                    container.classList.remove('open');
                });
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.country-dropdown-container')) {
                document.querySelectorAll('.country-dropdown-container.open').forEach((container) => {
                    container.classList.remove('open');
                });
            }
        });
    }

    function initCountrySelector() {
        setupDropdowns();

        const country = getStoredCountry();
        if (country) {
            applyCountry(country);
            return;
        }

        applyCountry("kazakhstan");
        createDialog();
    }

    window.applyCountry = applyCountry;
    window.openCountryDialog = createDialog;
    window.updateCountryUI = updateCountryUI;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCountrySelector);
    } else {
        initCountrySelector();
    }
})();
