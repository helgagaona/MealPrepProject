// meals.js

export function openFilters() {
    const filterGrid = document.querySelector('.filter-grid');
    const filterActionBtn = document.querySelector('.filter-action');
    filterActionBtn.classList.toggle('active');
    filterGrid.classList.toggle('active');
}

// Automatically attach the function to the button when this module is imported
const openFiltersBtn = document.querySelector('.open-filters');
if (openFiltersBtn) {
    openFiltersBtn.addEventListener('click', openFilters);
}
