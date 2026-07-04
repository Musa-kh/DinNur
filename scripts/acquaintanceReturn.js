(function () {
    const returnPositionKey = "acquaintanceReturnPosition";
    let positionToRestore = null;

    function getCurrentScrollPosition() {
        return window.scrollY || document.documentElement.scrollTop || 0;
    }

    function saveReturnPosition() {
        sessionStorage.setItem(returnPositionKey, String(getCurrentScrollPosition()));
    }

    function readReturnPosition() {
        const savedPosition = sessionStorage.getItem(returnPositionKey);

        if (savedPosition === null) {
            return null;
        }

        const parsedPosition = Number(savedPosition);

        if (!Number.isFinite(parsedPosition)) {
            sessionStorage.removeItem(returnPositionKey);
            return null;
        }

        return parsedPosition;
    }

    function restoreReturnPosition() {
        if (positionToRestore === null) {
            positionToRestore = readReturnPosition();
        }

        if (positionToRestore === null) {
            return;
        }

        requestAnimationFrame(function () {
            window.scrollTo(0, positionToRestore);
        });
    }

    function finishReturnRestore() {
        if (positionToRestore === null) {
            return;
        }

        window.scrollTo(0, positionToRestore);
        sessionStorage.removeItem(returnPositionKey);
        positionToRestore = null;
    }

    document.addEventListener("DOMContentLoaded", function () {
        const acquaintanceButton = document.querySelector(".acquaintancebtn");
        const backButton = document.querySelector(".back-button");

        if (acquaintanceButton) {
            acquaintanceButton.addEventListener("click", function () {
                saveReturnPosition();
                window.location.href = "acquaintance.html";
            });

            restoreReturnPosition();
        }

        if (backButton) {
            backButton.addEventListener("click", function (event) {
                event.preventDefault();
                window.location.href = "index.html";
            });
        }
    });

    window.addEventListener("load", function () {
        if (!document.querySelector(".acquaintancebtn")) {
            return;
        }

        restoreReturnPosition();
        setTimeout(finishReturnRestore, 100);
    });
})();
