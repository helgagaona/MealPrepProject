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

//

const API_KEY = "2899233d07e5451e97711a82e10e0fcc";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipesContainer = document.getElementById("recipes");

searchBtn.addEventListener("click", searchRecipes);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchRecipes();
  }
});

async function searchRecipes() {
  const query = searchInput.value.trim();

  if (!query) {
    recipesContainer.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  recipesContainer.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
        query
      )}&number=6&addRecipeInformation=true&addRecipeNutrition=true&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      recipesContainer.innerHTML = "<p>No meals found.</p>";
      return;
    }

    displayRecipes(data.results);

  } catch (error) {
    console.error("Error:", error);
    recipesContainer.innerHTML =
      "<p>Error loading meals. Check API key or quota.</p>";
  }
}

function displayRecipes(recipes) {
  recipesContainer.innerHTML = "";

  recipes.forEach(recipe => {
    const calories = recipe.nutrition?.nutrients?.find(
      n => n.name === "Calories"
    );

    const mealCard = document.createElement("div");
    mealCard.className = "element";

    mealCard.innerHTML = `
      <div class="image-container">
          <img src="${recipe.image}" alt="${recipe.title}">
      </div>
      <div class="meal-description">
          <h3>${recipe.title}</h3>
          <p>${recipe.summary.replace(/<[^>]*>?/gm, "").slice(0, 150)}...</p>
          <p class="calories">Calories: ${
            calories ? Math.round(calories.amount) : "N/A"
          }</p>
          <div class="meal-details">
              <p>⏱ ${recipe.readyInMinutes} mins</p>
          </div>
      </div>
      <button class="meal-btn">➕ Add to My Meals</button>
    `;

    recipesContainer.appendChild(mealCard);
  });
}
