
import express from "express";
import Recipe from "../models/Recipe.js";

const router = express.Router();

/* =============================
   GET ALL RECIPES
   ============================= */
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch {
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
});

/* =============================
   GET ALL UNIQUE INGREDIENTS
   ============================= */
router.get("/ingredients/all", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    const ingredientSet = new Set();

    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        ingredientSet.add(ing.name.toLowerCase().trim());
      });
    });

    res.json([...ingredientSet]);
  } catch {
    res.status(500).json({ message: "Failed to fetch ingredients" });
  }
});


router.post("/match", async (req, res) => {
  try {
    const { pantry } = req.body;
    const recipes = await Recipe.find();

    const normalizedPantry = pantry.map(i => i.toLowerCase().trim());

    const result = recipes.map(recipe => {
      const ingredientNames = recipe.ingredients.map(i =>
        i.name.toLowerCase().trim()
      );

      const missingIngredients = ingredientNames.filter(
        ing => !normalizedPantry.includes(ing)
      );

      const totalIngredients = ingredientNames.length;
      const matchPercent = totalIngredients === 0 ? 0
        : Math.round(((totalIngredients - missingIngredients.length) / totalIngredients) * 100);

      return {
        _id: recipe._id,
        title: recipe.title,
        category: recipe.category,
        cuisine: recipe.cuisine,
        time: recipe.time,
        imageKey: recipe.imageKey,
        canCook: missingIngredients.length === 0,
        missingCount: missingIngredients.length,
        missingIngredients,
        totalIngredients,
        matchPercent,
      };
    });

    res.json(result);
  } catch {
    res.status(500).json({ message: "Match failed" });
  }
});

/* =============================
   GET RECIPE BY SLUG (imageKey)
   ============================= */
router.get("/:slug", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ imageKey: req.params.slug });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch {
    res.status(400).json({ message: "Invalid recipe slug" });
  }
});

// /* =============================
//    ADD RECIPE
//    ============================= */
// router.post("/", async (req, res) => {
//   try {
//     const recipe = new Recipe(req.body);
//     const saved = await recipe.save();
//     res.json(saved);
//   } catch {
//     res.status(400).json({ message: "Failed to save recipe" });
//   }
// });

export default router;
