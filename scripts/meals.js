// meals.js

// ===============================
// API + Search Logic
// ===============================

const API_KEY = "2899233d07e5451e97711a82e10e0fcc";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipesContainer = document.getElementById("recipes");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// Load More state
let currentOffset = 0;
const resultsPerPage = 12;
let currentQuery = "";

// -------------------------------
// Search
if (searchBtn) {
  searchBtn.addEventListener("click", () => searchRecipes());
}

if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchRecipes();
    }
  });
}

// Load More listener
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    fetchRecipes(true);
  });
}

// -------------------------------
// Load latest recipes on page load
window.addEventListener("DOMContentLoaded", () => {
  loadLatestRecipes();
});

function loadLatestRecipes() {
  currentOffset = 0;
  currentQuery = ""; // this empties query for latest recipes
  fetchRecipes();
}

// -------------------------------
// Search function
async function searchRecipes(loadMore = false) {
  const query = searchInput.value.trim();

  if (!query && !loadMore) {
    recipesContainer.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  currentQuery = query;
  fetchRecipes(loadMore);
}

// -------------------------------
// Fetch recipes function
async function fetchRecipes(loadMore = false) {
  if (!loadMore) {
    currentOffset = 0;
    recipesContainer.innerHTML = "";
  }

  try {
    const url = `https://api.spoonacular.com/recipes/complexSearch?` +
      `query=${encodeURIComponent(currentQuery)}` +
      `&number=${resultsPerPage}` +
      `&offset=${currentOffset}` +
      `&addRecipeInformation=true` +
      `&addRecipeNutrition=true` +
      `&sort=created&sortDirection=desc` + // newest first
      `&apiKey=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      if (!loadMore) recipesContainer.innerHTML = "<p>No meals found.</p>";
      return;
    }

    displayRecipes(data.results);
    currentOffset += resultsPerPage;

  } catch (error) {
    console.error(error);
    recipesContainer.innerHTML =
      "<p>Error loading meals. Check API key or quota.</p>";
  }
}

// -------------------------------
// Display recipes in the container
function displayRecipes(recipes) {
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
          <div class="all-meal-details">
            <p class="calories">🔥 Calories: ${
              calories ? Math.round(calories.amount) : "N/A"
            }</p>
            <p>⏱ ${recipe.readyInMinutes} mins</p>
          </div>
      </div>
      <div class="actions">
        <a href="meal.html?id=${recipe.id}" class="see-meal">View Meal</a>
        <button class="meal-btn">+ Save</button>
      </div>
    `;

    recipesContainer.appendChild(mealCard);
  });
}