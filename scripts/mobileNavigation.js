const open = document.getElementById('openMenu');
const mobileMenu = document.getElementById('mobileMenu');
const close = document.getElementById('closeMenu');

open.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
})
close.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
})