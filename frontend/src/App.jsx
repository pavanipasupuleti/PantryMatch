import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeBook from "./pages/RecipeBook";
import RecipeDetail from "./pages/RecipeDetail";

function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [pantry, setPantry] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pm_pantry") || "[]"); } catch { return []; }
  });
  const [validIngredients, setValidIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("pm_pantry", JSON.stringify(pantry));
  }, [pantry]);

  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated]);

  if (authLoading) {
    return <p style={{ padding: "2rem", color: "#e8f0eb" }}>Loading…</p>;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  if (loading) {
    return <p style={{ padding: "2rem", color: "#e8f0eb" }}>Loading ingredients…</p>;
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
        <Route path="/recipes" element={<Recipes pantry={pantry} />} />
        <Route path="/recipe-book" element={<RecipeBook />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
      </Routes>
    </>
  );
}

export default App;
