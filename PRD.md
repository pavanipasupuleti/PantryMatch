# Product Requirements Document 
## PantryMatch — Smart Recipe Discovery Application



---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Target Users](#4-target-users)
5. [Tech Stack](#5-tech-stack)
6. [System Architecture](#6-system-architecture)
7. [Features & Requirements](#7-features--requirements)
8. [API Specification](#8-api-specification)
9. [Data Models](#9-data-models)
10. [User Flows](#10-user-flows)
11. [Non-Functional Requirements](#11-non-functional-requirements)
12. [Out of Scope](#12-out-of-scope)
13. [Future Enhancements](#13-future-enhancements)
14. [Open Questions](#14-open-questions)

---

## 1. Overview

**PantryMatch** is a full-stack web application that helps users discover recipes they can cook with the ingredients they already have at home. Users build a virtual pantry, and the app intelligently matches those ingredients against a recipe database — sorting results by cookability. An AI-powered feature also generates custom recipes based on available pantry items using the Anthropic Claude API.

---

## 2. Problem Statement

Everyday home cooks face two recurring pain points:

1. **"What can I cook with what I have?"** — Opening the fridge and not knowing what to make leads to decision fatigue, food waste, and unnecessary grocery trips.
2. **Recipe discovery overload** — Most recipe apps show all recipes regardless of what ingredients a user has, making it hard to find something immediately actionable.

**PantryMatch** solves both by flipping the model: start with what's in the pantry, then find what can be made.

---

## 3. Goals & Success Metrics

### Goals
- Reduce time from "I have these ingredients" to "here's what to cook" to under 60 seconds.
- Minimize food waste by helping users cook with what they have.
- Provide an AI fallback for generating creative recipes when no exact match exists.

### Success Metrics

| Metric | Target |
|--------|--------|
| Recipe match results returned | < 500ms |
| AI recipe generation response | < 3 seconds |
| Users who complete a pantry-to-recipe flow | > 60% of sessions |
| Recipe Book searches resulting in a click | > 40% |
| Mobile usability (no horizontal scroll, full touch support) | 100% pages |

---

## 4. Target Users

### Primary
- **Home cooks** (ages 18–45) who cook regularly and want to reduce grocery waste.
- **Students and young adults** on a budget who need to make the most of limited pantry stock.

### Secondary
- **Meal preppers** who browse the full recipe catalog for weekly planning.
- **Beginner cooks** who need guided, step-by-step recipes with clear ingredient lists.

---

## 5. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | 19.2.0 |
| Build Tool | Vite | 7.2.4 |
| Routing | React Router DOM | 6.30.2 |
| Icons | React Icons | 5.5.0 |
| Styling | Custom CSS (no UI framework) | — |
| State Management | React Context API + localStorage | — |
| Backend Framework | Express.js | 5.2.1 |
| Database | MongoDB (Mongoose ODM) | Mongoose 9.0.2 |
| Authentication | JWT (jsonwebtoken) + bcryptjs | JWT 9.0.3 |
| AI Integration | Anthropic Claude SDK | 0.78.0 |
| Runtime | Node.js | — |
| Dev Tools | nodemon, ESLint | — |

---

## 6. System Architecture

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND (React)                │
│                                                 │
│  Pages: Login, Register, Home, Recipes,         │
│         RecipeDetail, RecipeBook                │
│                                                 │
│  Components: Navbar, IngredientInput,           │
│              IngredientChip, PantryList,         │
│              AiRecipeModal                      │
│                                                 │
│  State: AuthContext (user, token)               │
│  Persistence: localStorage (pantry, favorites) │
└──────────────────────┬──────────────────────────┘
                       │ HTTP (Axios / Fetch)
                       │ VITE_API_URL
                       ▼
┌─────────────────────────────────────────────────┐
│              BACKEND (Express.js)               │
│  Port: 5055                                     │
│                                                 │
│  Routes:                                        │
│   /api/auth     → authRoutes.js                 │
│   /api/recipes  → recipeRoutes.js               │
│   /api/ai       → aiRoutes.js                   │
│                                                 │
│  Middleware: authMiddleware (JWT verification)  │
└──────────────┬──────────────────┬───────────────┘
               │                  │
               ▼                  ▼
┌──────────────────┐   ┌──────────────────────────┐
│  MongoDB Atlas   │   │  Anthropic Claude API     │
│  (Recipe, User)  │   │  (AI Recipe Generation)  │
└──────────────────┘   └──────────────────────────┘
```

### Project Directory Layout

```
PantryMatch/
├── backend/
│   ├── config/db.js               # MongoDB connection
│   ├── middleware/authMiddleware.js # JWT auth guard
│   ├── models/
│   │   ├── Recipe.js              # Recipe schema
│   │   └── User.js                # User schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth
│   │   ├── recipeRoutes.js        # /api/recipes
│   │   └── aiRoutes.js            # /api/ai
│   ├── server.js                  # Express app entry
│   └── package.json
├── frontend/
│   ├── public/                    # Static images (28 recipe images)
│   └── src/
│       ├── components/            # Reusable UI components
│       ├── context/AuthContext.jsx
│       ├── pages/                 # Page-level components
│       ├── styles/                # Per-page CSS files
│       ├── utils/imageMap.js      # Recipe image key → file mapping
│       └── App.jsx                # Routes & protected route logic
└── PRD.md
```

---

## 7. Features & Requirements

### 7.1 Authentication

#### FR-AUTH-01: User Registration
- **Description:** New users can create an account with name, email, and password.
- **Fields:** `name` (required), `email` (required, unique), `password` (required, min 6 chars)
- **Behavior:**
  - Passwords are hashed with bcryptjs before storage.
  - On success, returns a JWT token (7-day expiry) and user object.
  - Duplicate email returns a clear validation error.

#### FR-AUTH-02: User Login
- **Description:** Existing users log in with email and password.
- **Behavior:**
  - Verifies password against stored hash.
  - Returns JWT token and user info on success.
  - Invalid credentials return a 400 error with a message.

#### FR-AUTH-03: Protected Routes
- **Description:** All main app pages (Home, Recipes, RecipeDetail, RecipeBook) require an authenticated session.
- **Behavior:**
  - Auth state managed via `AuthContext`.
  - Unauthenticated users are redirected to `/login`.
  - Token and user stored in `localStorage` (`pm_token`, `pm_user`).
  - Logout clears localStorage and redirects to `/login`.

---

### 7.2 Pantry Management (Home Page)

#### FR-PANTRY-01: Add Ingredients
- **Description:** Users can type and add ingredients to their pantry.
- **Behavior:**
  - Autocomplete dropdown filters the full ingredient list from the database.
  - Only valid ingredients (present in the database) can be added.
  - Duplicate additions are silently ignored with a warning toast.
  - Press Enter or click a dropdown suggestion to add.
  - Toast notification (green) confirms successful addition.

#### FR-PANTRY-02: Remove Ingredients
- **Description:** Each pantry ingredient is displayed as a chip with a remove button.
- **Behavior:**
  - Clicking the "×" on a chip removes it from the pantry.
  - Pantry updates immediately in the UI.

#### FR-PANTRY-03: Clear Pantry
- **Description:** A "Clear All" button removes all ingredients at once.
- **Behavior:**
  - Clears the pantry array and updates localStorage.
  - Toast notification (info) confirms the action.

#### FR-PANTRY-04: Persistent Pantry
- **Description:** The pantry persists across page refreshes and navigation.
- **Storage Key:** `pm_pantry` in `localStorage`.

#### FR-PANTRY-05: Navigate to Matches
- **Description:** A "Check Recipes" button navigates to the Recipes page with the current pantry.
- **Behavior:**
  - Button is disabled or hidden when pantry is empty.
  - Passes pantry ingredients to the Recipes page.

---

### 7.3 Recipe Matching (Recipes Page)

#### FR-MATCH-01: Match Pantry to Recipes
- **Description:** The system compares the user's pantry against every recipe in the database.
- **Algorithm:**
  - For each recipe, check which ingredients are in the user's pantry (case-insensitive).
  - Compute: `matchPercent = (availableCount / totalIngredients) * 100`
  - Mark `canCook = true` if `matchPercent === 100`.
  - Compute `missingIngredients` array and `missingCount`.

#### FR-MATCH-02: Sort Results
- **Description:** Results are sorted to maximize usefulness.
- **Sort Order:**
  1. Recipes where `canCook === true` (highest match %) appear first.
  2. Within each group, sorted by `missingCount` ascending (fewest missing first).

#### FR-MATCH-03: Visual Match Indicators
- **Description:** Each recipe card displays a colored match badge.

| Badge Color | Condition |
|------------|-----------|
| Green | `matchPercent === 100` (can cook now) |
| Yellow | `50 <= matchPercent < 100` |
| Red | `matchPercent < 50` |

#### FR-MATCH-04: Missing Ingredient Count
- **Description:** Each card shows how many ingredients are missing.
- **Behavior:** Clicking a card with missing ingredients shows the full detail page including a shopping list.

---

### 7.4 Recipe Detail Page

#### FR-DETAIL-01: Full Recipe View
- **Description:** Displays the complete recipe including all metadata and steps.
- **Fields shown:** Title, category, cuisine, cooking time, image, all ingredients with quantities, step-by-step instructions.

#### FR-DETAIL-02: Ingredient Status
- **Description:** Ingredients are visually differentiated based on pantry availability.
- **Behavior:**
  - Ingredients the user has are styled normally (or with a check indicator).
  - Missing ingredients are highlighted (e.g., muted/red style).

#### FR-DETAIL-03: Shopping List
- **Description:** A dedicated section lists only the missing ingredients.
- **Behavior:** Only shown if `missingIngredients.length > 0`.

#### FR-DETAIL-04: Share Recipe
- **Description:** Users can share the recipe via native share or clipboard copy.
- **Behavior:**
  - If `navigator.share` is available (mobile/modern browsers): triggers native share sheet.
  - Fallback: copies the page URL to clipboard.

#### FR-DETAIL-05: Print Recipe
- **Description:** A "Print" button triggers the browser print dialog.

---

### 7.5 Recipe Book (Browsing Page)

#### FR-BOOK-01: Browse All Recipes
- **Description:** Displays the complete recipe catalog from the database.

#### FR-BOOK-02: Search by Name
- **Description:** A text input filters recipes in real-time by recipe title (case-insensitive substring match).

#### FR-BOOK-03: Filter by Category
- **Description:** Dropdown or button group to filter by meal category.
- **Options:** All, Breakfast, Lunch, Dinner, Snacks, Drinks.

#### FR-BOOK-04: Filter by Cuisine
- **Description:** Filter by cuisine type.
- **Options:** All, Indian, Italian, Chinese, American.

#### FR-BOOK-05: Filter by Cooking Time
- **Description:** Filter recipes by maximum cooking time.
- **Options:** All, Under 10 min, Under 20 min, Under 30 min, Under 40 min, Under 50 min.

#### FR-BOOK-06: Favorites / Bookmarks
- **Description:** Users can save recipes as favorites using a heart/bookmark icon.
- **Storage Key:** `pm_favourites` in `localStorage`.
- **Behavior:** Toggle saves or removes the recipe ID from favorites. A "Saved" filter tab shows only favorited recipes.

#### FR-BOOK-07: Lazy Load / Pagination
- **Description:** Recipes load incrementally to improve performance.
- **Behavior:** Shows 4 recipes initially. A "Show More" button loads the next 4 results. Repeats until all filtered results are shown.

---

### 7.6 AI Recipe Generation

#### FR-AI-01: Trigger AI Generation
- **Description:** A button on the Home page opens the AI recipe modal.
- **Precondition:** User must have at least 2 ingredients in the pantry.
- **Button label:** "AI: Generate a Recipe"

#### FR-AI-02: AI Modal
- **Description:** A full-screen modal displays the AI-generated recipe.
- **Content shown:** Recipe title, cuisine, category, cooking time, ingredient list (with available/missing status), step-by-step instructions.

#### FR-AI-03: Recipe Generation Logic
- **Description:** The system selects the best-matching recipe template from a curated set.
- **Templates Available (9):**
  - Fried Rice, Tomato Pasta, Egg Curry, Veggie Stir-Fry, Omelette, Chicken Rice, Noodle Soup, Paneer Masala, Toast & Egg
- **Scoring:**
  - Key ingredient match: +2 points per match
  - Optional ingredient match: +1 point per match
  - Missing key ingredient: -1 point per miss
  - Highest-scoring template is selected and returned.

#### FR-AI-04: Regenerate Recipe
- **Description:** A "Generate Another" button creates an alternative recipe suggestion without closing the modal.

#### FR-AI-05: Error Handling
- **Description:** If generation fails, the modal displays an error message with a retry button.

---

## 8. API Specification

### Base URL
```
http://localhost:5055/api
```

### Authentication Endpoints

#### POST `/auth/register`
Create a new user account.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response (201):**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": "abc123",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

**Error (400):** Email already in use or password too short.

---

#### POST `/auth/login`
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response (200):**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": "abc123",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

**Error (400):** Invalid credentials.

---

### Recipe Endpoints

#### GET `/recipes`
Retrieve all recipes from the database.

**Response (200):** Array of recipe objects (full schema).

---

#### GET `/recipes/ingredients/all`
Get a deduplicated list of all ingredient names across all recipes.

**Response (200):**
```json
["chicken", "rice", "egg", "tomato", "onion", ...]
```
Used to populate the autocomplete dropdown on the Home page.

---

#### POST `/recipes/match`
Match a user's pantry against all recipes and return sorted results.

**Request Body:**
```json
{
  "pantry": ["egg", "rice", "onion", "tomato"]
}
```

**Response (200):**
```json
[
  {
    "_id": "...",
    "title": "Egg Fried Rice",
    "category": "Lunch",
    "cuisine": "Chinese",
    "time": 20,
    "imageKey": "egg-fried-rice",
    "canCook": true,
    "missingCount": 0,
    "missingIngredients": [],
    "totalIngredients": 4,
    "matchPercent": 100
  },
  ...
]
```

---

#### GET `/recipes/:id`
Get full details for a single recipe.

**Response (200):** Full recipe object including `ingredients` and `steps` arrays.

**Error (404):** Recipe not found.

---

### AI Endpoints

#### POST `/ai/generate`
Generate a custom recipe based on pantry contents.

**Request Body:**
```json
{
  "pantry": ["egg", "rice", "garlic"]
}
```

**Validation:** `pantry` must have at least 2 items.

**Response (200):**
```json
{
  "title": "Garlic Egg Fried Rice",
  "category": "Lunch",
  "cuisine": "Chinese",
  "time": 15,
  "ingredients": [
    { "name": "egg", "quantity": "2 units" },
    { "name": "rice", "quantity": "1 cup" },
    { "name": "garlic", "quantity": "3 cloves" }
  ],
  "steps": [
    { "order": 1, "title": "Prep", "description": "..." },
    ...
  ]
}
```

**Error (400):** Pantry has fewer than 2 ingredients.

---

## 9. Data Models

### Recipe

```javascript
{
  _id: ObjectId,
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snacks", "Drinks"],
    required: true
  },
  cuisine: {
    type: String,
    enum: ["Indian", "Italian", "Chinese", "American"],
    required: true
  },
  time: { type: Number, required: true },     // minutes
  imageKey: { type: String, required: true }, // maps to /public/<imageKey>.png
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: String, required: true }
    }
  ],
  steps: [
    {
      order: { type: Number, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true }
    }
  ]
}
```

### User

```javascript
{
  _id: ObjectId,
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { type: String, required: true },  // bcrypt hash
  createdAt: Date,
  updatedAt: Date
}
```

---

## 10. User Flows

### Flow 1: New User Onboarding
```
Land on /login → Click "Register" → Fill name/email/password
→ Submit → Auto-login → Redirect to /
```

### Flow 2: Pantry-Based Recipe Discovery
```
/ (Home) → Add ingredients via autocomplete
→ Click "Check Recipes" → /recipes loads match results
→ Browse sorted cards → Click recipe → /recipe/:id
→ View instructions → Share or Print
```

### Flow 3: Browse Full Catalog
```
Navbar → "Recipe Book" → /recipe-book
→ Search by name / Filter by category+cuisine+time
→ Toggle favorites ❤ → Click card → /recipe/:id
```

### Flow 4: AI Recipe Generation
```
/ (Home) → Add 2+ ingredients → Click "AI: Generate a Recipe"
→ AiRecipeModal opens → Displays best-matched template recipe
→ Review ingredients and steps → [Optional] "Generate Another"
→ Close modal
```

---

## 11. Non-Functional Requirements

### Performance
- Recipe match API must respond within **500ms** for a pantry of up to 20 ingredients.
- Frontend initial load (Vite build) must be under **2 seconds** on a standard broadband connection.
- Autocomplete dropdown should filter with **< 100ms** perceived latency (client-side).

### Security
- All passwords hashed with bcryptjs (minimum 10 salt rounds).
- JWT tokens expire after 7 days.
- Auth middleware validates Bearer token on all protected API routes.
- No sensitive data (passwords, tokens) returned in API error responses.
- Environment variables used for all secrets (`MONGO_URI`, `JWT_SECRET`, `ANTHROPIC_API_KEY`).

### Usability
- App must be fully usable on mobile (responsive layout, no horizontal scroll).
- All interactive elements must have visible focus states.
- Toast notifications must auto-dismiss after 3–5 seconds.
- Error messages must be human-readable and actionable.

### Reliability
- MongoDB connection errors handled gracefully (server logs and returns 500).
- AI generation failures return a friendly error UI with retry capability (no blank modal).

### Maintainability
- All API routes separated into dedicated route files.
- CSS scoped per-page using separate `.css` files in `/styles/`.
- Image assets managed through a centralized `imageMap.js` utility.
- Auth state fully centralized in `AuthContext` — no prop drilling.

---

## 12. Out of Scope (v1.0)

The following features are explicitly excluded from the current version:

- User-submitted recipes (adding custom recipes to the database).
- Social features (sharing pantry with friends, recipe ratings, comments).
- Nutritional information per recipe.
- Grocery delivery / cart integration (e.g., Instacart, Amazon Fresh).
- Mobile native app (iOS / Android).
- Meal planning calendar view.
- Real Claude AI API calls (currently template-based; SDK is installed but not used for live inference).
- Multi-language / i18n support.
- Dark mode.

---

## 13. Future Enhancements

| Priority | Feature | Description |
|----------|---------|-------------|
| High | Live Claude AI integration | Replace template-based AI with real Anthropic API calls for truly dynamic recipe generation |
| High | User-defined recipes | Allow users to add their own recipes to the shared database |
| Medium | Pantry sync across devices | Store pantry in the user's MongoDB document instead of localStorage |
| Medium | Meal planner | Weekly plan view where users can schedule recipes per day |
| Medium | Nutritional info | Calories, macros per recipe (via third-party nutrition API) |
| Medium | Ingredient expiry tracking | Users mark when ingredients expire; get alerts and prioritized recipes |
| Low | Shopping list export | Export missing ingredients as a text/PDF shopping list or share to notes |
| Low | Recipe ratings & reviews | Users rate and comment on recipes |
| Low | Social / community features | Follow other users, share pantries, public recipe collections |
| Low | Grocery API integration | "Order missing ingredients" via Instacart or similar |
| Low | Dark mode | System-preference-aware dark theme |
| Low | Internationalization | Multi-language support (UI strings + recipe content) |

---

## 14. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Will the Anthropic Claude API be activated for live AI generation, or stay template-based for v1.0? | Product / Engineering | Open |
| 2 | Should pantry data be persisted server-side (MongoDB) instead of localStorage? | Engineering | Open |
| 3 | What is the target recipe count for the initial database seed? | Content | Open |
| 4 | Should favorites be tied to a user account (server-side) rather than localStorage? | Product | Open |
| 5 | Are there plans to expand cuisine/category options beyond the current 4/5? | Content | Open |
| 6 | What deployment target is planned — Vercel/Render, AWS, self-hosted? | DevOps | Open |

---

*This document is maintained alongside the codebase. Update this PRD whenever features are added, changed, or removed.*
