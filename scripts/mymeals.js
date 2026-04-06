// Get saved meals from localStorage
import { getSavedMeals, setSavedMeals } from './utils/storage.js';
const mymealsContainer = document.getElementById("myMealsContainer");

// Removes a meal by id, updates storage, shows modal and reloads the page to reflect changes
function removeMeal(id) {
  const meals = getSavedMeals().filter(meal => meal.id !== id);
  setSavedMeals(meals);

  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = "Meal removed from My Meals.";
    notification.classList.remove("hidden");
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 6000);
    // location.reload();
  }
  
}

// Stop from running if we aren't on the mymeals.html page
if (!mymealsContainer) {
  console.log("mymeals.js: Not on the my meals page. Skipping.");
} else {

  // Render saved meals on the page
  function renderMeals() {
    const meals = getSavedMeals();

    // Show message if no meals are saved
    if (!meals.length) {
      mymealsContainer.innerHTML = "<p>No saved meals yet.</p>";
      return;
    }

    mymealsContainer.innerHTML = "";

    meals.forEach(meal => {
      const card = document.createElement("div");
      card.className = "element";

      card.innerHTML = `
        <div class="image-container">
          <img src="${meal.image}" alt="${meal.title}">
        </div>
        <div class="meal-description">
          <h3>${meal.title}</h3>
          <p>${meal.summary ? meal.summary.replace(/<[^>]*>?/gm, "").slice(0, 150) : ""}...</p>
          <p class="calories">🔥 Calories: ${meal.calories}</p>
          <p>⏱ ${meal.readyInMinutes} mins</p>
        </div>
        <div class="actions">
          <a href="meal.html?id=${meal.id}" class="see-meal">View Meal</a>
          <button class="remove-btn">Remove</button>
        </div>
      `;

      // Remove meal when button is clicked
      card.querySelector(".remove-btn").addEventListener("click", () => {
        removeMeal(meal.id);
      });

      mymealsContainer.appendChild(card);
    });
  }
  // Render meals when the page loads
document.addEventListener("DOMContentLoaded", renderMeals);
}
