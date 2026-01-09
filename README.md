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




