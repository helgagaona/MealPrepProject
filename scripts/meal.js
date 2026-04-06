// meal.js
import { saveMeal } from './meals.js';
import {API_KEY} from './utils/api.js';

const mealContainer = document.getElementById("meal-recipe");

// Stop from running if we aren't on the meal.html page
if (!mealContainer) {
  console.log("meal.js: Not on the meals.html recipe details page. Skipping.");
} else {

  const urlParams = new URLSearchParams(window.location.search);
  const mealId = urlParams.get("id");

  if (!mealId) {
    mealContainer.innerHTML = "<p>No meal selected.</p>";
  } else {
    fetchMeal(mealId);
  }

  // Fetch meal details
  async function fetchMeal(id) {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${API_KEY}`
      );
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const meal = await response.json();
      renderMeal(meal);
    } catch (error) {
      console.error(error);
      mealContainer.innerHTML = "<p>Error loading meal details. Exceeded API Quota</p>";
    }
  }

  // Render meal details
  function renderMeal(meal) {
    const calories = meal.nutrition?.nutrients?.find(n => n.name === "Calories");
    const ingredientsHtml = meal.extendedIngredients
      .map(ing => `<li>${ing.original}</li>`)
      .join("");

    mealContainer.innerHTML = `
      <div class="complete-recipe">
        <h1 class="recipe-title">${meal.title}</h1>
        <div>
          <div class="image-recipe"><img src="${meal.image}" alt="${meal.title}"></div>
          <button class="save-meal-btn">+ Add to My Meals</button>
        </div>
        <div class="meal-details">
          <p class="tag">🔥 Calories: ${calories ? Math.round(calories.amount) : "N/A"}</p>
          <p class="tag">⏱ ${meal.readyInMinutes} mins</p>
          <p class="tag">🍴 Servings: ${meal.servings}</p>
        </div>
        <div class="information">
          <button class="read-summary-btn button-2"> Read Meal Summary &#9662;</button>
          <div class="meal-summary hide">
            <p>${meal.summary.replace(/<[^>]*>?/gm, "")}</p>
          </div>
          <button class="read-instructions-btn button-2"> Read Recipe &#9662;</button>
          <div class="meal-inst"> <h2>Ingredients</h2>
            <ul class="ingredients-list">${ingredientsHtml}</ul>
            <h2>Instructions</h2>
            <p>${meal.instructions || "No instructions available."}</p>
          </div>
        </div>
      </div>
    `;

    // Event Listeners
    const summaryBtn = mealContainer.querySelector(".read-summary-btn");
    const instructionsBtn = mealContainer.querySelector(".read-instructions-btn");
    const mealSummary = mealContainer.querySelector(".meal-summary");
    const mealInstructions = mealContainer.querySelector(".meal-inst");

    summaryBtn.addEventListener("click", () => mealSummary.classList.toggle("hide"));
    instructionsBtn.addEventListener("click", () => mealInstructions.classList.toggle("hide"));

    const saveBtn = mealContainer.querySelector(".save-meal-btn");
    saveBtn.addEventListener("click", () => {
      saveMeal({
        id: meal.id,
        title: meal.title,
        image: meal.image,
        calories: calories ? Math.round(calories.amount) : "N/A",
        readyInMinutes: meal.readyInMinutes
      });
    });
  }
}