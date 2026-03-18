PantryMatch 

PantryMatch is a full-stack web application that helps users instantly identify which recipes they can cook based on the ingredients they already have at home. Instead of scrolling endlessly through recipes, users simply input their pantry items and get intelligent, real-time recipe matches, reducing friction, saving time, and minimizing food waste.

 Features

1. Pantry Management

Add ingredients currently available at home

Remove individual ingredients using a close button

Clear the entire pantry with a single click

Prevents duplicate ingredient entries

Displays warnings for invalid ingredients using toast notifications

2. Recipe Matching

Displays recipes that can be cooked immediately

Highlights almost-cookable recipes with missing ingredients

Recipes are intelligently sorted by:

Cookable recipes first

Recipes with the least missing ingredients next

Shows:

Cooking time

Recipe category

3. Recipe Book

Browse all saved recipes

Search recipes by name

Filter recipes by:

Category (Breakfast, Lunch, Dinner, Snacks)

Cuisine

Cooking time

Pagination support with “Show More Recipes.”

4. Smart Feedback (Toasts)

✅ Success toast when recipes are fully cookable

⚠️ Warning toast when no recipes match

ℹ️ Info toast when ingredients are missing

## ⚡ Performance Optimizations (March 2026)

### Problem
The backend was deployed as a Vercel Serverless Function, which caused:
- **Cold starts** of 2–5 seconds on the first request after inactivity
- **MongoDB reconnecting** on every cold start (new connection each time)
- **Every API route** hitting MongoDB directly on every request — including individual recipe pages (`/api/recipes/:slug`)
- Vercel Speed Insights showed `button.action-btn` click delays of **5,312ms** (cold) and **1,681ms** (warm)

### Changes Made

**`backend/config/db.js`**
- Added connection caching using `global._mongooseConn`
- On warm serverless invocations, the existing MongoDB connection is reused instead of creating a new one
- Eliminates repeated connection overhead within the same function lifecycle

**`backend/routes/recipeRoutes.js`**
- Added a `getAllRecipes()` helper with a **5-minute in-memory cache**
- All 4 routes (`GET /`, `GET /ingredients/all`, `POST /match`, `GET /:slug`) now read from cache
- `GET /:slug` (used by RecipeDetail page) previously did a separate `Recipe.findOne()` — now resolved from the in-memory array, zero DB round-trip
- MongoDB is queried **at most once every 5 minutes** regardless of traffic

### Result
| Scenario | Before | After |
|---|---|---|
| First request (cold start) | 5,000ms+ | ~2,000ms (one-time) |
| Subsequent requests (warm) | 1,500–2,000ms | ~50–100ms |
| High traffic (many users) | MongoDB hit on every request | MongoDB hit once per 5 min |

---

🛠️ Tech Stack

Frontend

React (Vite)

React Router

Custom CSS

React Icons

Backend

Node.js

Express.js

MongoDB

Mongoose

⚙️ Setup Instructions

 Backend Setup

cd backend
npm install
npm start


Backend runs on:
👉 http://localhost:5055

 Frontend Setup
 
cd frontend
npm install
npm run dev


Frontend runs on:
👉 http://localhost:5173

📌 Project Goal

PantryMatch is designed to simplify meal decisions, optimize ingredient usage, and eliminate unnecessary grocery runs by aligning real-time pantry inputs with a personalized recipe database.

ScreenShots

HomePage:
<img width="2047" height="1331" alt="image" src="https://github.com/user-attachments/assets/395576f7-ce5f-4d18-8dff-aba3bb594cb2" />

RecipesPage:
<img width="2047" height="1331" alt="image" src="https://github.com/user-attachments/assets/067cc491-1bba-4b64-bf6b-fd23f6598c6c" />

RecipeDetailPage:
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/51a70bac-ef59-4d4f-a207-e4054218abde" />

RecipeBookPage:
<img width="2047" height="1331" alt="image" src="https://github.com/user-attachments/assets/e4310b07-68e3-429a-8c04-cd5569371e06" />




