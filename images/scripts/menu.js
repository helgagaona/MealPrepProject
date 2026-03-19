const menuBtn = document.querySelector('.menu-btn');

menuBtn.addEventListener('click', function() {
    const navMenu = document.querySelector('nav');
    navMenu.classList.toggle('active');
}
);