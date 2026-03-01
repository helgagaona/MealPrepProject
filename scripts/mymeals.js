// Container where saved meals will be displayed
const container = document.getElementById("myMealsContainer");

// Get saved meals from localStorage (or empty array if none exist)
function getSavedMeals() {
  return JSON.parse(localStorage.getItem("myMeals")) || [];
}

// Save updated meals back to localStorage
function setSavedMeals(meals) {
  localStorage.setItem("myMeals", JSON.stringify(meals));
}

// Remove a meal by id, update storage, and refresh the UI
function removeMeal(id) {
  const meals = getSavedMeals().filter(meal => meal.id !== id);
  setSavedMeals(meals);
  renderMeals();
}

// Render saved meals on the page
function renderMeals() {
  const meals = getSavedMeals();

  // Show message if no meals are saved
  if (!meals.length) {
    container.innerHTML = "<p>No saved meals yet.</p>";
    return;
  }

  container.innerHTML = "";

  meals.forEach(meal => {
    const card = document.createElement("div");
    card.className = "element";

    card.innerHTML = `
      <div class="image-container">
        <img src="${meal.image}" alt="${meal.title}">
      </div>
      <div class="meal-description">
        <h3>${meal.title}</h3>
        <p class="calories">🔥 Calories: ${meal.calories}</p>
        <p>⏱ ${meal.readyInMinutes} mins</p>
      </div>
      <button class="remove-btn">Remove</button>
    `;

    // Remove meal when button is clicked
    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeMeal(meal.id);
    });

    container.appendChild(card);
  });
}

// Render meals when the page loads
document.addEventListener("DOMContentLoaded", renderMeals);