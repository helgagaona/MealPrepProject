import {API_KEY} from './utils/api.js';

export async function initHomeGrid() {
    const gridContainer = document.getElementById('main-recipe-grid');

    // Stop everything if we aren't on the index.html details page
    if (!gridContainer) {
        console.log("index.js: Not on the Home Page. Skipping.");
        return;
    }
    const url = `https://api.spoonacular.com/recipes/random?number=3&includeNutrition=true&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Waiting for API Error: ${response.status}`);
        
        const data = await response.json();
        const recipes = data.recipes;

        const getNutrient = (meal, name) => {
            const n = meal.nutrition?.nutrients.find(nt => nt.name === name);
            return n ? Math.round(n.amount) : "0";
        };

        // Inject HTML
        gridContainer.innerHTML = `
            <div class="column1">
                <h1>Latest Recipes</h1>
                <div class="recipe-element1" data-id="${recipes[0].id}" style="cursor: pointer; object-fit:cover; background-image: url('${recipes[0].image}')">
                    <div class="home-recipe-details">
                        <h2>${recipes[0].title}</h2>
                        <h3>Calories: ${getNutrient(recipes[0], "Calories")}</h3>
                        <p>Protein: ${getNutrient(recipes[0], "Protein")}g | Carbs: ${getNutrient(recipes[0], "Carbohydrates")}g | Fat: ${getNutrient(recipes[0], "Fat")}g</p>
                    </div>
                </div>
            </div>
            <div class="column2">
                <div class="recipe-element2" data-id="${recipes[1].id}" style="cursor: pointer; background-image: url('${recipes[1].image}')">
                    <div class="home-recipe-details">
                        <h2>${recipes[1].title}</h2>
                        <h3>Calories: ${getNutrient(recipes[1], "Calories")}</h3>
                        <p>Protein: ${getNutrient(recipes[1], "Protein")}g | Carbs: ${getNutrient(recipes[1], "Carbohydrates")}g | Fat: ${getNutrient(recipes[1], "Fat")}g</p>
                    </div>
                </div>
                <div class="recipe-element3" data-id="${recipes[2].id}" style="cursor: pointer; background-image: url('${recipes[2].image}')">
                    <div class="home-recipe-details">
                        <h2>${recipes[2].title}</h2>
                        <h3>Calories: ${getNutrient(recipes[2], "Calories")}</h3>
                        <p>Protein: ${getNutrient(recipes[2], "Protein")}g | Carbs: ${getNutrient(recipes[2], "Carbohydrates")}g | Fat: ${getNutrient(recipes[2], "Fat")}g</p>
                    </div>
                </div>
            </div>
        `;

        // Make the cards clickable after they are added to the DOM
        const cards = gridContainer.querySelectorAll('[class^="recipe-element"]');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                // Redirect to meal.html page with the ID in the URL
                window.location.href = `meal.html?id=${id}`;
            });
        });

    } catch (error) {
        console.error("Waiting for API", error);
        gridContainer.innerHTML = `<p style="align-self: start;"<p>Error loading meals. Exceeded API key or quota.</p>`;
    }
}