const menuBtn = document.querySelector('.menu-btn');
menuBtn.addEventListener('click', openMenu);

export function openMenu() {
    const navMenu = document.querySelector('nav');
    navMenu.classList.toggle('active');

}


