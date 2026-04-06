const closeBtn = document.querySelector(".close-btn");
const modal = document.querySelector(".modal");

// If modal element is not found skip modal functionality
if (!modal) {
    console.log("modal.js: Modal element not found. Skipping modal functionality.");
} else {
    console.log("modal.js: Modal element found. Modal functionality initialized.");
}
// If close button is found add event listener to close the modal
if (closeBtn) {
    closeBtn.addEventListener("click", function() {
        modal.classList.add("hide");
    });
}
// Show the modal after 6 seconds
window.addEventListener("load", function () {
    setTimeout(() => {
        if (modal) {
            modal.classList.remove("hide"); // this will show the modal
        }
    }, 6000);
});
