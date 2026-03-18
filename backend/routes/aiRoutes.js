import express from "express";

const router = express.Router();

/* ─────────────────────────────────────────────
   Ingredient category map
───────────────────────────────────────────── */
const CATEGORIES = {
  protein:    ["chicken", "eggs", "beef", "fish", "tofu", "paneer", "shrimp", "lamb", "tuna", "salmon", "pork"],
  grain:      ["rice", "pasta", "bread", "noodles", "oats", "flour", "quinoa", "tortilla"],
  vegetable:  ["tomato", "onion", "garlic", "spinach", "potato", "carrot", "bell pepper", "mushroom",
               "broccoli", "cucumber", "lettuce", "corn", "peas", "zucchini", "celery", "cabbage"],
  dairy:      ["milk", "butter", "cheese", "cream", "yogurt", "cheddar", "paneer"],
  sauce:      ["soy sauce", "tomato sauce", "olive oil", "hot sauce", "mayo", "ketchup", "vinegar"],
  spice:      ["salt", "pepper", "cumin", "coriander", "turmeric", "paprika", "chili",
               "garam masala", "oregano", "basil", "thyme", "ginger"],
};

function categorize(pantry) {
  const result = {};
  for (const [cat, items] of Object.entries(CATEGORIES)) {
    result[cat] = pantry.filter(p => items.includes(p));
  }
  return result;
}

/* ─────────────────────────────────────────────
   Recipe templates
   Each template has:
     key      – ingredients that define the recipe (score +2 each if present)
     optional – bonus ingredients (score +1 each)
     build    – function that receives (pantry, cats) and returns the recipe object
───────────────────────────────────────────── */
const TEMPLATES = [
  /* ── Fried Rice ── */
  {
    key: ["rice", "eggs", "soy sauce", "garlic", "onion"],
    optional: ["chicken", "carrot", "peas", "butter", "spring onion", "mushroom"],
    build(pantry) {
      const protein = ["chicken", "shrimp", "tofu"].find(p => pantry.includes(p)) || null;
      const extras  = ["carrot", "peas", "mushroom"].filter(v => pantry.includes(v));
      return {
        title: `${protein ? protein.charAt(0).toUpperCase() + protein.slice(1) + " " : ""}Fried Rice`,
        category: "Lunch", cuisine: "Chinese", time: 20,
        ingredients: [
          { name: "rice",      quantity: "1½ cups",  have: pantry.includes("rice") },
          { name: "eggs",      quantity: "2",         have: pantry.includes("eggs") },
          { name: "soy sauce", quantity: "2 tbsp",    have: pantry.includes("soy sauce") },
          { name: "garlic",    quantity: "3 cloves",  have: pantry.includes("garlic") },
          { name: "onion",     quantity: "1 medium",  have: pantry.includes("onion") },
          ...(protein ? [{ name: protein, quantity: "150 g", have: true }] : []),
          ...extras.map(v => ({ name: v, quantity: "½ cup", have: true })),
          { name: "oil",       quantity: "2 tbsp",    have: false },
        ],
        steps: [
          { order: 1, title: "Cook rice",        description: "Cook rice until fluffy. Spread on a tray and let cool for 10 minutes so grains separate." },
          { order: 2, title: "Scramble eggs",    description: "Heat oil in a wok over high heat. Add beaten eggs and scramble lightly, then set aside." },
          { order: 3, title: "Sauté aromatics",  description: "Add garlic and onion to the wok, stir-fry until golden and fragrant, about 2 minutes." },
          ...(protein ? [{ order: 4, title: `Cook ${protein}`, description: `Add ${protein} and stir-fry until cooked through, about 4 minutes.` }] : []),
          { order: protein ? 5 : 4, title: "Add rice", description: `Add cooled rice${extras.length ? " and " + extras.join(", ") : ""}. Toss on high heat for 3–4 minutes.` },
          { order: protein ? 6 : 5, title: "Season & serve", description: "Add soy sauce, return eggs to wok, toss to combine. Season with pepper and serve hot." },
        ],
      };
    },
  },

  /* ── Tomato Pasta ── */
  {
    key: ["pasta", "tomato", "garlic", "onion", "olive oil"],
    optional: ["cheese", "basil", "chili", "beef", "mushroom", "spinach"],
    build(pantry) {
      const protein  = ["beef", "chicken"].find(p => pantry.includes(p));
      const toppings = ["cheese", "basil", "spinach", "mushroom"].filter(v => pantry.includes(v));
      return {
        title: `${protein ? protein.charAt(0).toUpperCase() + protein.slice(1) + " " : ""}Tomato Pasta`,
        category: "Dinner", cuisine: "Italian", time: 25,
        ingredients: [
          { name: "pasta",      quantity: "250 g",    have: pantry.includes("pasta") },
          { name: "tomato",     quantity: "3 large",  have: pantry.includes("tomato") },
          { name: "garlic",     quantity: "4 cloves", have: pantry.includes("garlic") },
          { name: "onion",      quantity: "1 medium", have: pantry.includes("onion") },
          { name: "olive oil",  quantity: "3 tbsp",   have: pantry.includes("olive oil") },
          ...(protein ? [{ name: protein, quantity: "200 g", have: true }] : []),
          ...toppings.map(t => ({ name: t, quantity: "to taste", have: true })),
          { name: "salt & pepper", quantity: "to taste", have: false },
        ],
        steps: [
          { order: 1, title: "Boil pasta",      description: "Cook pasta in well-salted boiling water until al dente. Reserve ½ cup pasta water before draining." },
          { order: 2, title: "Sauté base",      description: "Heat olive oil in a pan. Sauté onion until soft, add garlic and cook 1 minute until fragrant." },
          ...(protein ? [{ order: 3, title: `Brown ${protein}`, description: `Add ${protein} and cook until browned. Season with salt and pepper.` }] : []),
          { order: protein ? 4 : 3, title: "Make sauce", description: "Add chopped tomatoes. Simmer on medium heat for 10 minutes, stirring occasionally." },
          { order: protein ? 5 : 4, title: "Combine",    description: "Toss drained pasta into the sauce. Add a splash of pasta water if too thick." },
          { order: protein ? 6 : 5, title: "Serve",      description: toppings.length ? `Top with ${toppings.join(", ")} and serve immediately.` : "Season to taste and serve immediately." },
        ],
      };
    },
  },

  /* ── Egg Curry ── */
  {
    key: ["eggs", "tomato", "onion", "garlic", "turmeric"],
    optional: ["garam masala", "coriander", "cream", "chili", "ginger", "butter"],
    build(pantry) {
      const spices = ["garam masala", "coriander", "chili"].filter(s => pantry.includes(s));
      return {
        title: "Spiced Egg Curry",
        category: "Dinner", cuisine: "Indian", time: 30,
        ingredients: [
          { name: "eggs",     quantity: "4",         have: pantry.includes("eggs") },
          { name: "tomato",   quantity: "2 large",   have: pantry.includes("tomato") },
          { name: "onion",    quantity: "1 large",   have: pantry.includes("onion") },
          { name: "garlic",   quantity: "4 cloves",  have: pantry.includes("garlic") },
          { name: "turmeric", quantity: "½ tsp",     have: pantry.includes("turmeric") },
          ...spices.map(s => ({ name: s, quantity: "1 tsp", have: true })),
          ...(pantry.includes("cream")  ? [{ name: "cream",  quantity: "3 tbsp", have: true }] : []),
          ...(pantry.includes("ginger") ? [{ name: "ginger", quantity: "1 inch", have: true }] : []),
          { name: "oil",      quantity: "2 tbsp",    have: false },
        ],
        steps: [
          { order: 1, title: "Boil eggs",    description: "Hard-boil eggs for 9 minutes. Peel and score lightly with a knife so the curry coats them." },
          { order: 2, title: "Fry base",     description: `Heat oil and fry onion${pantry.includes("ginger") ? ", ginger" : ""} and garlic until deep golden, about 6 minutes.` },
          { order: 3, title: "Add spices",   description: `Stir in turmeric${spices.length ? " and " + spices.join(", ") : ""}. Cook for 1 minute until fragrant.` },
          { order: 4, title: "Add tomatoes", description: "Add chopped tomatoes and cook down to a thick masala paste, about 8 minutes." },
          { order: 5, title: "Simmer",       description: `Add ½ cup water${pantry.includes("cream") ? " and cream" : ""}. Simmer 5 minutes.` },
          { order: 6, title: "Add eggs",     description: "Add boiled eggs, coat well in the gravy. Simmer 3 more minutes. Serve with rice or bread." },
        ],
      };
    },
  },

  /* ── Veggie Stir-Fry ── */
  {
    key: ["garlic", "soy sauce", "onion", "carrot", "broccoli"],
    optional: ["mushroom", "bell pepper", "tofu", "ginger", "corn", "peas", "spinach"],
    build(pantry) {
      const veggies = ["carrot", "broccoli", "mushroom", "bell pepper", "corn", "peas", "spinach"].filter(v => pantry.includes(v));
      const protein  = pantry.includes("tofu") ? "tofu" : null;
      return {
        title: "Garlic Veggie Stir-Fry",
        category: "Dinner", cuisine: "Chinese", time: 15,
        ingredients: [
          { name: "garlic",    quantity: "4 cloves", have: pantry.includes("garlic") },
          { name: "soy sauce", quantity: "3 tbsp",   have: pantry.includes("soy sauce") },
          { name: "onion",     quantity: "1 medium", have: pantry.includes("onion") },
          ...veggies.map(v => ({ name: v, quantity: "1 cup", have: true })),
          ...(protein ? [{ name: protein, quantity: "200 g, cubed", have: true }] : []),
          ...(pantry.includes("ginger") ? [{ name: "ginger", quantity: "1 inch", have: true }] : []),
          { name: "oil",       quantity: "2 tbsp",   have: false },
          { name: "sesame oil",quantity: "1 tsp",    have: false },
        ],
        steps: [
          { order: 1, title: "Prep",           description: "Cut all vegetables into even, bite-sized pieces for uniform cooking." },
          { order: 2, title: "Heat wok",        description: "Heat oil in a wok over the highest heat until it just starts to smoke." },
          { order: 3, title: "Aromatics first", description: `Add garlic${pantry.includes("ginger") ? " and ginger" : ""} and stir for 30 seconds — don't let it burn.` },
          { order: 4, title: "Hard veggies",    description: `Add ${["carrot", "broccoli", "corn"].filter(v => pantry.includes(v)).join(", ") || "harder vegetables"} first. Toss constantly for 2 minutes.` },
          { order: 5, title: "Soft veggies",    description: `Add ${["mushroom", "bell pepper", "peas", "spinach"].filter(v => pantry.includes(v)).join(", ") || "remaining vegetables"} and stir-fry 2 more minutes.` },
          { order: 6, title: "Sauce & serve",   description: "Add soy sauce and a drizzle of sesame oil. Toss to coat and serve over rice or noodles." },
        ],
      };
    },
  },

  /* ── Omelette ── */
  {
    key: ["eggs", "butter", "onion"],
    optional: ["cheese", "tomato", "mushroom", "spinach", "bell pepper", "milk", "chili"],
    build(pantry) {
      const fillings = ["tomato", "mushroom", "spinach", "bell pepper", "chili"].filter(v => pantry.includes(v));
      return {
        title: `Loaded ${fillings.length > 1 ? fillings.slice(0, 2).map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(" & ") + " " : ""}Omelette`,
        category: "Breakfast", cuisine: "American", time: 10,
        ingredients: [
          { name: "eggs",    quantity: "3",        have: pantry.includes("eggs") },
          { name: "butter",  quantity: "1 tbsp",   have: pantry.includes("butter") },
          { name: "onion",   quantity: "¼ medium", have: pantry.includes("onion") },
          ...(pantry.includes("milk")   ? [{ name: "milk",   quantity: "2 tbsp",   have: true }] : []),
          ...(pantry.includes("cheese") ? [{ name: "cheese", quantity: "30 g",      have: true }] : []),
          ...fillings.map(f => ({ name: f, quantity: "handful", have: true })),
          { name: "salt & pepper", quantity: "to taste", have: false },
        ],
        steps: [
          { order: 1, title: "Beat eggs",      description: `Whisk eggs${pantry.includes("milk") ? " with milk" : ""}, salt, and pepper until smooth and slightly frothy.` },
          { order: 2, title: "Cook fillings",  description: `Melt half the butter and sauté onion${fillings.length ? " and " + fillings.join(", ") : ""} for 2 minutes. Set aside.` },
          { order: 3, title: "Start omelette", description: "Add remaining butter to pan on medium-low. Pour in eggs and let them set around the edges." },
          { order: 4, title: "Fill",           description: `When top is just barely set, add fillings${pantry.includes("cheese") ? " and cheese" : ""} to one half.` },
          { order: 5, title: "Fold & serve",   description: "Fold omelette in half over fillings. Slide onto plate and serve immediately." },
        ],
      };
    },
  },

  /* ── Chicken Rice ── */
  {
    key: ["chicken", "rice", "onion", "garlic", "tomato"],
    optional: ["turmeric", "garam masala", "yogurt", "butter", "coriander", "ginger"],
    build(pantry) {
      const hasYogurt = pantry.includes("yogurt");
      const spices    = ["turmeric", "garam masala"].filter(s => pantry.includes(s));
      return {
        title: "One-Pot Chicken Rice",
        category: "Dinner", cuisine: "Indian", time: 40,
        ingredients: [
          { name: "chicken", quantity: "500 g",    have: true },
          { name: "rice",    quantity: "1½ cups",  have: pantry.includes("rice") },
          { name: "onion",   quantity: "2 medium", have: pantry.includes("onion") },
          { name: "garlic",  quantity: "5 cloves", have: pantry.includes("garlic") },
          { name: "tomato",  quantity: "2 medium", have: pantry.includes("tomato") },
          ...spices.map(s => ({ name: s, quantity: "1 tsp", have: true })),
          ...(hasYogurt ? [{ name: "yogurt", quantity: "3 tbsp", have: true }] : []),
          ...(pantry.includes("butter") ? [{ name: "butter", quantity: "1 tbsp", have: true }] : []),
          { name: "oil",    quantity: "2 tbsp",   have: false },
          { name: "water",  quantity: "2½ cups",  have: false },
        ],
        steps: [
          { order: 1, title: "Marinate",      description: `Mix chicken with ${spices.length ? spices.join(", ") + "," : "salt, pepper,"} salt${hasYogurt ? " and yogurt" : ""}. Rest 10 minutes.` },
          { order: 2, title: "Sauté base",    description: `Fry onion${pantry.includes("ginger") ? " and ginger" : ""} in oil until golden. Add garlic and cook 1 minute.` },
          { order: 3, title: "Add tomatoes",  description: "Add chopped tomatoes and cook until they break down into a paste, about 6 minutes." },
          { order: 4, title: "Brown chicken", description: "Add marinated chicken. Sear on all sides until golden, about 5 minutes." },
          { order: 5, title: "Add rice",      description: "Add washed rice. Stir to coat with the masala." },
          { order: 6, title: "Cook",          description: "Add water and salt. Bring to a boil, then cover and cook on low heat 20 minutes until rice is done." },
        ],
      };
    },
  },

  /* ── Noodle Soup ── */
  {
    key: ["noodles", "garlic", "soy sauce", "onion"],
    optional: ["eggs", "mushroom", "spinach", "chicken", "ginger", "carrot", "chili"],
    build(pantry) {
      const protein  = ["chicken", "eggs", "tofu"].find(p => pantry.includes(p));
      const veggies  = ["mushroom", "spinach", "carrot"].filter(v => pantry.includes(v));
      return {
        title: `${protein ? protein.charAt(0).toUpperCase() + protein.slice(1) + " " : "Veggie "}Noodle Soup`,
        category: "Lunch", cuisine: "Chinese", time: 20,
        ingredients: [
          { name: "noodles",   quantity: "200 g",    have: true },
          { name: "garlic",    quantity: "4 cloves", have: pantry.includes("garlic") },
          { name: "soy sauce", quantity: "3 tbsp",   have: pantry.includes("soy sauce") },
          { name: "onion",     quantity: "1 medium", have: pantry.includes("onion") },
          ...(protein ? [{ name: protein, quantity: protein === "eggs" ? "2" : "200 g", have: true }] : []),
          ...veggies.map(v => ({ name: v, quantity: "1 cup", have: true })),
          ...(pantry.includes("ginger") ? [{ name: "ginger", quantity: "1 inch", have: true }] : []),
          { name: "water",    quantity: "4 cups",   have: false },
          { name: "oil",      quantity: "1 tbsp",   have: false },
        ],
        steps: [
          { order: 1, title: "Build broth",   description: `Sauté garlic${pantry.includes("ginger") ? " and ginger" : ""} in oil for 30 seconds. Add water and soy sauce. Bring to a simmer.` },
          ...(protein && protein !== "eggs" ? [{ order: 2, title: `Cook ${protein}`, description: `Add ${protein} to the broth and simmer until cooked through, about 8 minutes.` }] : []),
          { order: protein && protein !== "eggs" ? 3 : 2, title: "Add noodles", description: "Add noodles and cook according to package instructions in the broth." },
          { order: protein && protein !== "eggs" ? 4 : 3, title: "Add veg",     description: veggies.length ? `Add ${veggies.join(", ")} in the last 2 minutes of cooking.` : "Add any greens in the last 2 minutes." },
          ...(protein === "eggs" ? [{ order: 4, title: "Soft-boil eggs", description: "Crack eggs directly into broth or add pre-boiled halved eggs." }] : []),
          { order: protein && protein !== "eggs" ? 5 : (protein === "eggs" ? 5 : 4), title: "Serve", description: "Ladle into bowls. Top with a drizzle of chili oil if you have it." },
        ],
      };
    },
  },

  /* ── Paneer Masala ── */
  {
    key: ["paneer", "tomato", "onion", "garlic", "turmeric"],
    optional: ["cream", "garam masala", "butter", "coriander", "chili", "ginger"],
    build(pantry) {
      const spices = ["garam masala", "chili", "coriander"].filter(s => pantry.includes(s));
      return {
        title: "Paneer Masala",
        category: "Dinner", cuisine: "Indian", time: 30,
        ingredients: [
          { name: "paneer",   quantity: "250 g, cubed", have: true },
          { name: "tomato",   quantity: "3 medium",     have: pantry.includes("tomato") },
          { name: "onion",    quantity: "2 medium",     have: pantry.includes("onion") },
          { name: "garlic",   quantity: "4 cloves",     have: pantry.includes("garlic") },
          { name: "turmeric", quantity: "½ tsp",        have: pantry.includes("turmeric") },
          ...spices.map(s => ({ name: s, quantity: "1 tsp", have: true })),
          ...(pantry.includes("cream")  ? [{ name: "cream",  quantity: "4 tbsp",  have: true }] : []),
          ...(pantry.includes("butter") ? [{ name: "butter", quantity: "1 tbsp",  have: true }] : []),
          ...(pantry.includes("ginger") ? [{ name: "ginger", quantity: "1 inch",  have: true }] : []),
          { name: "oil",      quantity: "2 tbsp",      have: false },
        ],
        steps: [
          { order: 1, title: "Pan-fry paneer",  description: "Pan-fry paneer cubes in oil or butter until golden on all sides. Set aside." },
          { order: 2, title: "Blend gravy",     description: `Blend onion, tomato${pantry.includes("ginger") ? ", ginger" : ""}, and garlic into a smooth puree.` },
          { order: 3, title: "Cook gravy",      description: `Pour puree into pan. Add turmeric${spices.length ? " and " + spices.join(", ") : ""}. Cook until oil separates, about 10 minutes.` },
          { order: 4, title: "Add cream",       description: pantry.includes("cream") ? "Stir in cream and simmer 2 minutes." : "Add ¼ cup water and simmer 2 minutes." },
          { order: 5, title: "Add paneer",      description: "Add paneer and gently stir to coat. Simmer 3 minutes." },
          { order: 6, title: "Serve",           description: "Garnish with coriander if available. Serve with roti or rice." },
        ],
      };
    },
  },

  /* ── Toast & Egg ── */
  {
    key: ["bread", "eggs", "butter"],
    optional: ["cheese", "tomato", "spinach", "chili", "garlic", "mushroom"],
    build(pantry) {
      const toppings = ["tomato", "spinach", "mushroom"].filter(v => pantry.includes(v));
      return {
        title: `Egg${pantry.includes("cheese") ? " & Cheese" : ""} Toast`,
        category: "Breakfast", cuisine: "American", time: 10,
        ingredients: [
          { name: "bread",   quantity: "2 slices", have: true },
          { name: "eggs",    quantity: "2",         have: pantry.includes("eggs") },
          { name: "butter",  quantity: "1 tbsp",   have: pantry.includes("butter") },
          ...(pantry.includes("cheese")  ? [{ name: "cheese",  quantity: "2 slices", have: true }] : []),
          ...(pantry.includes("garlic")  ? [{ name: "garlic",  quantity: "1 clove",  have: true }] : []),
          ...toppings.map(t => ({ name: t, quantity: "handful", have: true })),
          { name: "salt & pepper", quantity: "to taste", have: false },
        ],
        steps: [
          { order: 1, title: "Toast bread",    description: "Toast bread slices until crispy and golden." },
          { order: 2, title: "Sauté toppings", description: toppings.length ? `Sauté ${toppings.join(" and ")} in butter for 2 minutes. Season with salt and pepper.` : "Melt butter in a pan over medium heat." },
          { order: 3, title: "Cook eggs",      description: "Fry eggs to your liking — sunny-side up, over easy, or scrambled." },
          ...(pantry.includes("garlic") ? [{ order: 4, title: "Rub garlic", description: "Rub a halved garlic clove over the hot toast for flavour." }] : []),
          { order: pantry.includes("garlic") ? 5 : 4, title: "Assemble", description: `Layer toast with${toppings.length ? " " + toppings.join(", ") + "," : ""} egg${pantry.includes("cheese") ? ", and cheese" : ""}. Serve immediately.` },
        ],
      };
    },
  },
];

/* ─────────────────────────────────────────────
   Scoring — rank all templates by pantry match
───────────────────────────────────────────── */
function rankTemplates(pantry) {
  return TEMPLATES.map((t, idx) => {
    const keyHits      = t.key.filter(i => pantry.includes(i)).length;
    const optionalHits = t.optional.filter(i => pantry.includes(i)).length;
    const keyMisses    = t.key.length - keyHits;
    const score        = keyHits * 2 + optionalHits - keyMisses;
    return { t, score, idx };
  }).sort((a, b) => b.score - a.score);
}

/* ─────────────────────────────────────────────
   POST /api/ai/generate
   Body: { pantry: string[], exclude?: number[] }
   exclude: array of template indexes already shown
───────────────────────────────────────────── */
router.post("/generate", (req, res) => {
  const { pantry = [], exclude = [] } = req.body;

  if (pantry.length < 2) {
    return res.status(400).json({ message: "Add at least 2 ingredients to generate a recipe." });
  }

  const normalized = pantry.map(i => i.toLowerCase().trim());
  const ranked     = rankTemplates(normalized);

  // Pick the best template not in the exclude list; fall back to top if all excluded
  const pick = ranked.find(r => !exclude.includes(r.idx)) || ranked[0];
  const recipe = pick.t.build(normalized);

  recipe.missingKey   = recipe.ingredients.filter(i => !i.have).map(i => i.name);
  recipe.templateIdx  = pick.idx; // send back so frontend can exclude it next time

  res.json(recipe);
});

export default router;
