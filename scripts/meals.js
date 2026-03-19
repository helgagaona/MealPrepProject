// scripts/meals.js

const API_KEY = import.meta.env.VITE_API_KEY;
console.log("hi");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipesContainer = document.getElementById("recipes");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// --- MyMeals Functions ---

export function getSavedMeals() {
  return JSON.parse(localStorage.getItem("myMeals")) || [];
}

export function setSavedMeals(meals) {
  localStorage.setItem("myMeals", JSON.stringify(meals));
}

export function saveMeal(meal) {
  const meals = getSavedMeals();
  if (meals.some(m => m.id === meal.id)) {
    alert("Already saved!");
    return;
  }
  meals.push(meal);
  setSavedMeals(meals);
  alert("Meal saved!");
}

// --- State Management ---
let currentOffset = 0;
const resultsPerPage = 12;
let currentQuery = "";

// --- Initialization ---
// Only run listeners and initial load if we are on the Meals page (recipesContainer exists)
if (recipesContainer) {
    if (searchBtn) {
        searchBtn.addEventListener("click", () => searchRecipes());
    }

    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") searchRecipes();
        });
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => fetchRecipes(true));
    }

    // Load initial content
    loadLatestRecipes();
}

function loadLatestRecipes() {
    currentOffset = 0;
    currentQuery = ""; 
    fetchRecipes();
}

async function searchRecipes(loadMore = false) {
    if (!recipesContainer) return;

    const query = searchInput ? searchInput.value.trim() : "";

    if (!query && !loadMore) {
        recipesContainer.innerHTML = "<p>Please enter a search term.</p>";
        return;
    }

    currentQuery = query;
    fetchRecipes(loadMore);
}

async function fetchRecipes(loadMore = false) {
    // Final safety check to prevent "null innerHTML" errors
    if (!recipesContainer) return;

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
            `&sort=created&sortDirection=desc` +
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
        console.error("meals.js Error:", error);
        recipesContainer.innerHTML = "<p>Error loading meals. Check API key or quota.</p>";
    }
}

function displayRecipes(recipes) {
    if (!recipesContainer) return;

    recipes.forEach(recipe => {
        const calories = recipe.nutrition?.nutrients?.find(n => n.name === "Calories");

        const mealCard = document.createElement("div");
        mealCard.className = "element";

        mealCard.innerHTML = `
            <div class="image-container">
                <img src="${recipe.image}" alt="${recipe.title}">
            </div>
            <div class="meal-description">
                <h3>${recipe.title}</h3>
                <p>${recipe.summary ? recipe.summary.replace(/<[^>]*>?/gm, "").slice(0, 150) : ""}...</p>
                <div class="all-meal-details">
                    <p class="calories">🔥 Calories: ${calories ? Math.round(calories.amount) : "N/A"}</p>
                    <p>⏱ ${recipe.readyInMinutes} mins</p>
                </div>
            </div>
            <div class="actions">
                <a href="meal.html?id=${recipe.id}" class="see-meal">View Meal</a>
                <button class="meal-btn">+ Save</button>
            </div>
        `;

        recipesContainer.appendChild(mealCard);
        
        const saveBtn = mealCard.querySelector(".meal-btn");
        saveBtn.addEventListener("click", () => {
            saveMeal({
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                calories: calories ? Math.round(calories.amount) : "N/A",
                readyInMinutes: recipe.readyInMinutes
            });
        });
    });
}