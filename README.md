PantryMatch

PantryMatch is a full-stack web application that helps users determine which recipes they can cook immediately based on the ingredients available at home.
Instead of searching endlessly, users simply enter what they have in their pantry, and the app intelligently matches it with recipes.

Features

1. Pantry Management

Add ingredients you currently have
Remove individual ingredients using a close button
Clear the entire pantry with one click
Prevents duplicate ingredients
Shows warnings for invalid ingredients using toast messages

 2. Recipe Matching

Shows recipes you can cook right now
Highlights recipes that are almost possible (missing ingredients)

 Recipes are sorted by:

-> Cookable first

-> Least missing ingredients next

-> Displays cooking time and category

3. Recipe Book

Browse all saved recipes
Search recipes by name

Filter by:

Category (Breakfast, Lunch, Dinner, Snacks)

Cuisine

Cooking time

“Show More Recipes” pagination

4. Smart Feedback (Toasts)

Success toast when recipes are cookable

Warning toast if nothing matches

Info toast when ingredients are missing

🛠️ Tech Stack

Frontend

React (Vite)

React Router

CSS (custom styling)

React Icons

Backend

Node.js

Express.js

MongoDB

Mongoose

⚙️ Setup

Backend Setup

cd backend

npm install

npm start

Backend runs on:
http://localhost:5055

Frontend Setup

cd frontend

npm install

npm run dev

Frontend runs on:
http://localhost:5173

ScreenShots

HomePage:
<img width="2047" height="1331" alt="image" src="https://github.com/user-attachments/assets/395576f7-ce5f-4d18-8dff-aba3bb594cb2" />

RecipesPage:
<img width="2047" height="1331" alt="image" src="https://github.com/user-attachments/assets/067cc491-1bba-4b64-bf6b-fd23f6598c6c" />

RecipeDetailPage:
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/51a70bac-ef59-4d4f-a207-e4054218abde" />

RecipeBookPage:
<img width="2047" height="1331" alt="image" src="https://github.com/user-attachments/assets/e4310b07-68e3-429a-8c04-cd5569371e06" />




