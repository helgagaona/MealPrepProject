export function getSavedMeals() {
  return JSON.parse(localStorage.getItem("myMeals")) || [];
}

export function setSavedMeals(meals) {
  localStorage.setItem("myMeals", JSON.stringify(meals));
}
