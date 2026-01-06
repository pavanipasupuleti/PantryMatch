export const buildValidIngredients = (recipes) => {
    const ingredientSet = new Set();
  
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(i => {
        ingredientSet.add(i.name.toLowerCase().trim());
      });
    });
  
    return Array.from(ingredientSet);
  };
  