import { getSavedMeals, setSavedMeals } from './utils/storage.js';
import { API_KEY } from './utils/api.js';

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipesContainer = document.getElementById("recipes");
const loadMoreBtn = document.getElementById("loadMoreBtn");

export function saveMeal(meal) {
  const meals = getSavedMeals();
  if (meals.some(m => m.id === meal.id)) {
    console.log("Meal already saved.");
    return false; // If the meal is already saved, don't save it again
  }
  else { // If the meal is not saved already, save it
    meals.push(meal);
    setSavedMeals(meals);
    const notification = document.getElementById("notification");
    if (notification) {
        notification.textContent = "Meal saved to My Meals!";
        notification.classList.remove("hidden");
        setTimeout(() => {
        notification.classList.add("hidden");
        }, 3000);
    }
    return true;
  }
}

let currentOffset = 0;
const resultsPerPage = 8;
let currentQuery = "";

async function fetchRecipes(loadMore = false) {
    // This is a final safety check to prevent "null innerHTML" errors
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
        recipesContainer.innerHTML = "<p>Error loading meals. Exceeded API key or quota.</p>";
    }
}

// Stop from running if we aren't on the meals.html page
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

export function displayRecipes(recipes) {
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
        saveBtn.type = "button";
        saveBtn.addEventListener("click", (event) => {
            event.preventDefault();
            const saved = saveMeal({
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                summary: recipe.summary,
                calories: calories ? Math.round(calories.amount) : "N/A",
                readyInMinutes: recipe.readyInMinutes
            });
            if (saved) {
                saveBtn.textContent = "✔ Saved";
                saveBtn.disabled = true;
                
            }
        });
      });
}