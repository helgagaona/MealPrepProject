// meal.js

const API_KEY = "2899233d07e5451e97711a82e10e0fcc";
const mealContainer = document.getElementById("meal-recipe");

// 1. Get ID from URL
const urlParams = new URLSearchParams(window.location.search);
const mealId = urlParams.get("id");

if (!mealId) {
  mealContainer.innerHTML = "<p>No meal selected.</p>";
} else {
  fetchMeal(mealId);
}

// 2. Fetch meal details
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
    mealContainer.innerHTML = "<p>Error loading meal details.</p>";
  }
}

// 3. Render meal details
function renderMeal(meal) {
  const calories = meal.nutrition?.nutrients?.find(n => n.name === "Calories");

  mealContainer.innerHTML = `
    <div class="image-recipe">
      <img src="${meal.image}" alt="${meal.title}">
    </div>

    <div class="meal-details">
      <p class="tag">🔥 Calories: ${calories ? Math.round(calories.amount) : "N/A"}</p>
      <p class="tag">⏱ ${meal.readyInMinutes} mins</p>
      <p class="tag">🍴 Servings: ${meal.servings}</p>
    </div>
    
    <h1>${meal.title}</h1>
    
  
    <div class="meal-summary">
      <button class="read-more-btn"> Read Meal Summary </button>
      <p>${meal.summary.replace(/<[^>]*>?/gm, "")}</p>
    </div>
    <div class="meal-instructions"
      <p Read Instructions </p>
      <h2>Instructions</h2>
      <p>${meal.instructions || "No instructions available."}</p>
    </div>
  `;
}

// hide read more 

// const readMoreBtn = document.querySelector('.show-read-more');

// readMoreBtn.addEventListener("click", function() {
//   readMoreBtn.classList.toggle('show');
// });


