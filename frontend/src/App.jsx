
// import { Routes, Route } from "react-router-dom";
// import { useState } from "react";

// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Recipes from "./pages/Recipes";
// import RecipeBook from "./pages/RecipeBook";
// import RecipeDetail from "./pages/RecipeDetail";

// function App() {
//   const [pantry, setPantry] = useState([]);

//   return (
//     <>
//       {/* Static navbar on every page */}
//       <Navbar />

//       <Routes>
//         <Route
//           path="/"
//           element={<Home pantry={pantry} setPantry={setPantry} />}
//         />
//         <Route
//           path="/recipes"
//           element={<Recipes pantry={pantry} />}
//         />
//         <Route
//           path="/recipe-book"
//           element={<RecipeBook />}
//         />
//         <Route
//           path="/recipe/:id"
//           element={<RecipeDetail />}
//         />
//       </Routes>
//     </>
//   );
// }

// export default App;
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeBook from "./pages/RecipeBook";
import RecipeDetail from "./pages/RecipeDetail";

function App() {
  const [pantry, setPantry] = useState([]);
  const [validIngredients, setValidIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5055/api/recipes")
      .then(res => res.json())
      .then(data => {
        const ingredientSet = new Set();

        data.forEach(recipe => {
          recipe.ingredients.forEach(i => {
            ingredientSet.add(i.name.toLowerCase().trim());
          });
        });

        setValidIngredients([...ingredientSet]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading ingredients…</p>;
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              pantry={pantry}
              setPantry={setPantry}
              validIngredients={validIngredients}
            />
          }
        />

        <Route
          path="/recipes"
          element={<Recipes pantry={pantry} />}
        />

        <Route path="/recipe-book" element={<RecipeBook />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
      </Routes>
    </>
  );
}

export default App;

