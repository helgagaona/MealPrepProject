const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".close-btn");
const form = document.getElementById("subscribeForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const isAdultCheckbox = document.getElementById("isAdult");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const adultError = document.getElementById("adultError");

if (!modal) {
    console.log("modal.js: Modal not found, skipping...");
} else {
    console.log("modal.js: Modal initialized");

    window.addEventListener("load", () => {
        setTimeout(() => {
            modal.classList.remove("hide");
        }, 6000);
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.add("hide");
        });
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hide");
        }
    });
}

// Validate name
function validateName() {
    const nameValue = nameInput.value.trim();
    const namePattern = /^[A-Za-zÀ-ÿ\s]{2,}$/;

    if (nameValue === "") {
        nameError.textContent = "Full name is required.";
        return false;
    }

    if (!namePattern.test(nameValue)) {
        nameError.textContent = "Please enter a valid name.";
        return false;
    }

    nameError.textContent = "";
    return true;
}

// Validate email
function validateEmail() {
    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
        emailError.textContent = "Email is required.";
        return false;
    }

    if (!emailPattern.test(emailValue)) {
        emailError.textContent = "Please enter a valid email address.";
        return false;
    }

    emailError.textContent = "";
    return true;
}

// Validate age checkbox
function validateAdult() {
    if (!isAdultCheckbox.checked) {
        adultError.textContent = "You must confirm that you are 18 or older.";
        return false;
    }

    adultError.textContent = "";
    return true;
}

// Live validation
nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
isAdultCheckbox.addEventListener("change", validateAdult);

// Form submit
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isAdultValid = validateAdult();

    if (isNameValid && isEmailValid && isAdultValid) {
        const successMessage = document.getElementById("successMessage");
        successMessage.textContent = "Thank you for subscribing!";
        successMessage.classList.add("show");
        form.reset();
        setTimeout(() => {
        successMessage.classList.remove("show");
        modal.classList.add("hide");
        }, 1500);

    }
});