const closeBtn = document.querySelector(".close-btn");
const modal = document.querySelector(".modal");

closeBtn.addEventListener("click", function() {
    modal.classList.add("hide");
});

window.addEventListener("load", function () {
    setTimeout(() => {
        modal.classList.remove("hide"); // this will show the modal
    }, 6000); // 6000 ms = 6 seconds
});