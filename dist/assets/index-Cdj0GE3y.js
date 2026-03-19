(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const s of e.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerPolicy&&(e.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?e.credentials="include":n.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function a(n){if(n.ep)return;n.ep=!0;const e=r(n);fetch(n.href,e)}})();const k="bda7b88f70f04d3489882cc7ff7fa647";console.log("hi");const g=document.getElementById("searchInput"),L=document.getElementById("searchBtn"),c=document.getElementById("recipes"),I=document.getElementById("loadMoreBtn");function $(){return JSON.parse(localStorage.getItem("myMeals"))||[]}function S(i){localStorage.setItem("myMeals",JSON.stringify(i))}function w(i){const t=$();if(t.some(r=>r.id===i.id)){alert("Already saved!");return}t.push(i),S(t),alert("Meal saved!")}let f=0;const C=12;let b="";c&&(L&&L.addEventListener("click",()=>P()),g&&g.addEventListener("keypress",i=>{i.key==="Enter"&&P()}),I&&I.addEventListener("click",()=>M(!0)),A());function A(){f=0,b="",M()}async function P(i=!1){if(!c)return;const t=g?g.value.trim():"";if(!t&&!i){c.innerHTML="<p>Please enter a search term.</p>";return}b=t,M(i)}async function M(i=!1){if(c){i||(f=0,c.innerHTML="");try{const t=`https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(b)}&number=${C}&offset=${f}&addRecipeInformation=true&addRecipeNutrition=true&sort=created&sortDirection=desc&apiKey=${k}`,r=await fetch(t);if(!r.ok)throw new Error(`API Error: ${r.status}`);const a=await r.json();if(!a.results||a.results.length===0){i||(c.innerHTML="<p>No meals found.</p>");return}B(a.results),f+=C}catch(t){console.error("meals.js Error:",t),c.innerHTML="<p>Error loading meals. Check API key or quota.</p>"}}}function B(i){c&&i.forEach(t=>{var e,s;const r=(s=(e=t.nutrition)==null?void 0:e.nutrients)==null?void 0:s.find(u=>u.name==="Calories"),a=document.createElement("div");a.className="element",a.innerHTML=`
            <div class="image-container">
                <img src="${t.image}" alt="${t.title}">
            </div>
            <div class="meal-description">
                <h3>${t.title}</h3>
                <p>${t.summary?t.summary.replace(/<[^>]*>?/gm,"").slice(0,150):""}...</p>
                <div class="all-meal-details">
                    <p class="calories">🔥 Calories: ${r?Math.round(r.amount):"N/A"}</p>
                    <p>⏱ ${t.readyInMinutes} mins</p>
                </div>
            </div>
            <div class="actions">
                <a href="meal.html?id=${t.id}" class="see-meal">View Meal</a>
                <button class="meal-btn">+ Save</button>
            </div>
        `,c.appendChild(a),a.querySelector(".meal-btn").addEventListener("click",()=>{w({id:t.id,title:t.title,image:t.image,calories:r?Math.round(r.amount):"N/A",readyInMinutes:t.readyInMinutes})})})}const H=document.querySelector(".menu-btn");H.addEventListener("click",q);function q(){document.querySelector("nav").classList.toggle("active")}const R="bda7b88f70f04d3489882cc7ff7fa647",o=document.getElementById("meal-recipe");if(!o)console.log("meal.js: Not on the recipe details page. Skipping.");else{let i=function(n){var p,E;const e=(E=(p=n.nutrition)==null?void 0:p.nutrients)==null?void 0:E.find(v=>v.name==="Calories"),s=n.extendedIngredients.map(v=>`<li>${v.original}</li>`).join("");o.innerHTML=`
      <div class="complete-recipe">
        <h1 class="recipe-title">${n.title}</h1>
        <div>
          <div class="image-recipe"><img src="${n.image}" alt="${n.title}"></div>
          <button class="save-meal-btn">+ Add to My Meals</button>
        </div>
        <div class="meal-details">
          <p class="tag">🔥 Calories: ${e?Math.round(e.amount):"N/A"}</p>
          <p class="tag">⏱ ${n.readyInMinutes} mins</p>
          <p class="tag">🍴 Servings: ${n.servings}</p>
        </div>
        <div class="information">
          <button class="read-summary-btn button-2"> Read Meal Summary &#9662;</button>
          <div class="meal-summary hide">
            <p>${n.summary.replace(/<[^>]*>?/gm,"")}</p>
          </div>
          <button class="read-instructions-btn button-2"> Read Recipe &#9662;</button>
          <div class="meal-inst"> <h2>Ingredients</h2>
            <ul class="ingredients-list">${s}</ul>
            <h2>Instructions</h2>
            <p>${n.instructions||"No instructions available."}</p>
          </div>
        </div>
      </div>
    `;const u=o.querySelector(".read-summary-btn"),l=o.querySelector(".read-instructions-btn"),d=o.querySelector(".meal-summary"),m=o.querySelector(".meal-inst");u.addEventListener("click",()=>d.classList.toggle("hide")),l.addEventListener("click",()=>m.classList.toggle("hide")),o.querySelector(".save-meal-btn").addEventListener("click",()=>{w({id:n.id,title:n.title,image:n.image,calories:e?Math.round(e.amount):"N/A",readyInMinutes:n.readyInMinutes})})};const r=new URLSearchParams(window.location.search).get("id");r?a(r):o.innerHTML="<p>No meal selected.</p>";async function a(n){try{const e=await fetch(`https://api.spoonacular.com/recipes/${n}/information?includeNutrition=true&apiKey=${R}`);if(!e.ok)throw new Error(`API Error: ${e.status}`);const s=await e.json();i(s)}catch(e){console.error(e),o.innerHTML="<p>Error loading meal details.</p>"}}}async function T(){const i=document.getElementById("main-recipe-grid");if(!i){console.log("index.js: Home grid container not found. Skipping.");return}const r="https://api.spoonacular.com/recipes/random?number=3&includeNutrition=true&apiKey=bda7b88f70f04d3489882cc7ff7fa647";try{const a=await fetch(r);if(!a.ok)throw new Error(`API Error: ${a.status}`);const e=(await a.json()).recipes,s=(l,d)=>{var h;const m=(h=l.nutrition)==null?void 0:h.nutrients.find(p=>p.name===d);return m?Math.round(m.amount):"0"};i.innerHTML=`
            <div class="column1">
                <h1>Latest Recipes</h1>
                <div class="recipe-element1" data-id="${e[0].id}" style="cursor: pointer; object-fit:cover; background-image: url('${e[0].image}')">
                    <div class="home-recipe-details">
                        <h2>${e[0].title}</h2>
                        <h3>Calories: ${s(e[0],"Calories")}</h3>
                        <p>Protein: ${s(e[0],"Protein")}g | Carbs: ${s(e[0],"Carbohydrates")}g | Fat: ${s(e[0],"Fat")}g</p>
                    </div>
                </div>
            </div>
            <div class="column2">
                <div class="recipe-element2" data-id="${e[1].id}" style="cursor: pointer; background-image: url('${e[1].image}')">
                    <div class="home-recipe-details">
                        <h2>${e[1].title}</h2>
                        <h3>Calories: ${s(e[1],"Calories")}</h3>
                        <p>Protein: ${s(e[1],"Protein")}g | Carbs: ${s(e[1],"Carbohydrates")}g | Fat: ${s(e[1],"Fat")}g</p>
                    </div>
                </div>
                <div class="recipe-element3" data-id="${e[2].id}" style="cursor: pointer; background-image: url('${e[2].image}')">
                    <div class="home-recipe-details">
                        <h2>${e[2].title}</h2>
                        <h3>Calories: ${s(e[2],"Calories")}</h3>
                        <p>Protein: ${s(e[2],"Protein")}g | Carbs: ${s(e[2],"Carbohydrates")}g | Fat: ${s(e[2],"Fat")}g</p>
                    </div>
                </div>
            </div>
        `,i.querySelectorAll('[class^="recipe-element"]').forEach(l=>{l.addEventListener("click",()=>{const d=l.getAttribute("data-id");window.location.href=`meal.html?id=${d}`})})}catch(a){console.error("Home grid failed:",a),i.innerHTML='<p style="color: white; padding: 20px; text-align: center;">Unable to load recipes. Please check your API key.</p>'}}const y=document.getElementById("myMealsContainer");function O(i){const t=$().filter(r=>r.id!==i);S(t),N()}function N(){const i=$();if(!i.length){y.innerHTML="<p>No saved meals yet.</p>";return}y.innerHTML="",i.forEach(t=>{const r=document.createElement("div");r.className="element",r.innerHTML=`
      <div class="image-container">
        <img src="${t.image}" alt="${t.title}">
      </div>
      <div class="meal-description">
        <h3>${t.title}</h3>
        <p class="calories">🔥 Calories: ${t.calories}</p>
        <p>⏱ ${t.readyInMinutes} mins</p>
      </div>
      <div class="actions">
        <a href="meal.html?id=${t.id}" class="see-meal">View Meal</a>
        <button class="remove-btn">Remove</button>
      </div>
    `,r.querySelector(".remove-btn").addEventListener("click",()=>{O(t.id)}),y.appendChild(r)})}document.addEventListener("DOMContentLoaded",N);T();
