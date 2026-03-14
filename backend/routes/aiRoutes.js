import express from "express";

const router = express.Router();

const INGREDIENT_TYPES = {
  protein: ["eggs", "chicken", "beef", "pork", "fish", "tofu", "lentils", "paneer", "shrimp", "lamb", "turkey", "tuna", "salmon", "bacon", "ham", "chickpeas"],
  carb: ["rice", "pasta", "bread", "flour", "oats", "noodles", "potato", "sweet potato", "quinoa", "corn", "roti", "tortilla"],
  vegetable: ["onion", "garlic", "tomato", "spinach", "carrot", "bell pepper", "mushroom", "broccoli", "zucchini", "cucumber", "cabbage", "peas", "celery", "eggplant", "cauliflower", "kale", "lettuce"],
  dairy: ["milk", "butter", "cheese", "cream", "yogurt", "ghee", "cheddar", "mozzarella"],
  spice: ["salt", "pepper", "cumin", "turmeric", "paprika", "garam masala", "chili", "oregano", "basil", "thyme", "cinnamon", "cardamom", "ginger", "coriander", "mustard"],
  oil: ["olive oil", "oil", "coconut oil", "vegetable oil"],
  sauce: ["soy sauce", "tomato sauce", "hot sauce", "ketchup", "vinegar", "lemon juice", "lime juice"]
};

function classifyIngredients(pantry) {
  const result = {};
  for (const [type, list] of Object.entries(INGREDIENT_TYPES)) {
    result[type] = pantry.filter(item =>
      list.some(i => item.includes(i) || i.includes(item))
    );
  }
  return result;
}

const TEMPLATES = {
  "Stir Fry": (protein, vegs, sauce) => [
    { order: 1, title: "Prep Ingredients", description: `Slice ${protein} into bite-sized pieces. Chop ${vegs.join(", ")}.` },
    { order: 2, title: "Heat Oil", description: "Heat oil in a wok or large pan over high heat until shimmering." },
    { order: 3, title: "Cook Protein", description: `Add ${protein} and cook 3-4 minutes, stirring, until cooked through.` },
    { order: 4, title: "Add Vegetables", description: `Add ${vegs.join(", ")} and stir-fry for 2-3 minutes until tender-crisp.` },
    { order: 5, title: "Season & Toss", description: `Add ${sauce || "soy sauce"}, salt, and pepper. Toss everything to coat.` },
    { order: 6, title: "Serve", description: "Serve immediately over rice or noodles." }
  ],
  "Scramble": (_, vegs) => [
    { order: 1, title: "Prep", description: `Dice ${vegs.join(", ")} finely.` },
    { order: 2, title: "Sauté Veggies", description: `Heat butter or oil in a pan. Cook ${vegs.join(", ")} over medium heat for 3-4 minutes.` },
    { order: 3, title: "Add Eggs", description: "Beat eggs with a pinch of salt. Pour over vegetables and stir gently." },
    { order: 4, title: "Season", description: "Add pepper and any herbs. Cook until eggs are just set — don't overcook." },
    { order: 5, title: "Serve", description: "Serve immediately with toast or bread." }
  ],
  "Curry": (protein, vegs) => [
    { order: 1, title: "Sauté Aromatics", description: "Heat oil in a pan. Add onion and garlic. Cook over medium heat until golden, about 5 minutes." },
    { order: 2, title: "Add Spices", description: "Add cumin, turmeric, and garam masala. Stir and cook for 1 minute until fragrant." },
    { order: 3, title: "Add Tomatoes", description: "Add tomatoes or tomato sauce. Cook until oil separates from the masala, about 5 minutes." },
    { order: 4, title: "Add Main Ingredients", description: `Add ${protein} and ${vegs.join(", ")}. Stir to coat with masala.` },
    { order: 5, title: "Simmer", description: "Add 1 cup water. Cover and simmer for 15-20 minutes until everything is cooked through." },
    { order: 6, title: "Serve", description: "Garnish with fresh coriander. Serve hot with rice or roti." }
  ],
  "Fried Rice": (protein, vegs) => [
    { order: 1, title: "Use Day-Old Rice", description: "Cold, day-old rice works best — it fries without clumping." },
    { order: 2, title: "Scramble Eggs", description: "Heat oil in a wok on high. Scramble eggs quickly and set aside." },
    { order: 3, title: "Fry Vegetables", description: `Stir-fry ${vegs.join(", ")} on high heat for 2-3 minutes.` },
    { order: 4, title: "Add Rice", description: "Add rice and break up any clumps. Toss and fry for 2-3 minutes." },
    { order: 5, title: "Season", description: "Add soy sauce, salt, and pepper. Mix in the scrambled eggs." },
    { order: 6, title: "Serve", description: "Serve hot, garnished with green onions if available." }
  ],
  "Soup": (protein, vegs) => [
    { order: 1, title: "Sauté Aromatics", description: "Heat oil in a pot. Add onion and garlic. Cook until soft, about 3-4 minutes." },
    { order: 2, title: "Add Vegetables", description: `Add ${vegs.join(", ")}. Stir for 2 minutes.` },
    { order: 3, title: "Add Liquid", description: "Pour in 4 cups water or stock. Bring to a boil." },
    { order: 4, title: "Simmer", description: `${protein ? `Add ${protein}. S` : "S"}immer on low heat for 20-25 minutes.` },
    { order: 5, title: "Season", description: "Season with salt, pepper, and herbs to taste." },
    { order: 6, title: "Serve", description: "Ladle into bowls. Serve with crusty bread." }
  ]
};

const TIME_MAP = {
  "Curry": "30-35 mins",
  "Soup": "25-30 mins",
  "Fried Rice": "20-25 mins",
  "Stir Fry": "15-20 mins",
  "Scramble": "10-15 mins"
};

function pickTemplate(classified, pantry) {
  const { protein, vegetable, carb, spice } = classified;
  const hasRice = carb.some(c => c.includes("rice"));
  const hasEggs = pantry.includes("eggs");
  const hasSpices = spice.length >= 2;

  if (hasRice && vegetable.length > 0) return "Fried Rice";
  if (protein.length > 0 && hasSpices) return "Curry";
  if (hasEggs && vegetable.length > 0) return "Scramble";
  if (protein.length > 0 && vegetable.length > 0) return "Stir Fry";
  if (vegetable.length > 0) return "Soup";
  return "Scramble";
}

function generateRecipe(pantry) {
  const classified = classifyIngredients(pantry);
  const templateName = pickTemplate(classified, pantry);
  const stepFn = TEMPLATES[templateName];

  const mainProtein = classified.protein[0] || "eggs";
  const mainVegs = classified.vegetable.slice(0, 3);
  const mainSauce = classified.sauce[0] || null;

  const adjectives = ["Quick", "Easy", "Homestyle", "Simple", "Hearty", "Classic", "Fresh"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const title = `${adj} ${mainProtein.charAt(0).toUpperCase() + mainProtein.slice(1)} ${templateName}`;

  const steps = stepFn(mainProtein, mainVegs.length ? mainVegs : ["vegetables"], mainSauce);

  const ingredients = [
    ...classified.protein.slice(0, 2).map(p => ({ name: p, quantity: "as needed" })),
    ...classified.vegetable.slice(0, 4).map(v => ({ name: v, quantity: "as needed" })),
    ...classified.dairy.slice(0, 1).map(d => ({ name: d, quantity: "as needed" })),
    ...classified.spice.slice(0, 3).map(s => ({ name: s, quantity: "to taste" })),
    { name: "oil", quantity: "2 tbsp" },
    { name: "salt", quantity: "to taste" }
  ].filter((v, i, arr) => arr.findIndex(x => x.name === v.name) === i);

  return {
    title,
    method: templateName,
    estimatedTime: TIME_MAP[templateName] || "20-25 mins",
    ingredients,
    steps,
    note: "AI-generated from your pantry. Adjust quantities and seasoning to taste."
  };
}

router.post("/generate", (req, res) => {
  try {
    const { pantry } = req.body;
    if (!pantry || pantry.length === 0) {
      return res.status(400).json({ message: "Add some ingredients to your pantry first." });
    }
    const recipe = generateRecipe(pantry);
    res.json(recipe);
  } catch {
    res.status(500).json({ message: "Failed to generate recipe." });
  }
});

export default router;
