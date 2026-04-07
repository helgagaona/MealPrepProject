const loader = document.querySelector(".loader");

window.addEventListener("load", () => {
    console.log("Loader Loaded and Hid")
    loader.classList.add("hidden");

    setTimeout(() => {
        loader.style.display = "none";
    }, 500);
});
    