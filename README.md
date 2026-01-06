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
