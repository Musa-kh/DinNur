const open = document.getElementById('openMenu');
const mobileMenu = document.getElementById('mobileMenu');
const close = document.getElementById('closeMenu');
const menuLinks = mobileMenu.querySelectorAll('a');

open.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
})
close.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
})

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});