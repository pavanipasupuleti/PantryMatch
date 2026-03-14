import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeBook from "./pages/RecipeBook";
import RecipeDetail from "./pages/RecipeDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  const [pantry, setPantry] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pm_pantry") || "[]"); }
    catch { return []; }
  });
  const [validIngredients, setValidIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Persist pantry to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pm_pantry", JSON.stringify(pantry));
  }, [pantry]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/recipes`)
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
  }, [user]);

  if (user && loading) {
    return <p style={{ padding: "2rem", color: "#eaffd0" }}>Loading…</p>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Home pantry={pantry} setPantry={setPantry} validIngredients={validIngredients} />
          </ProtectedRoute>
        } />
        <Route path="/recipes" element={
          <ProtectedRoute><Recipes pantry={pantry} /></ProtectedRoute>
        } />
        <Route path="/recipe-book" element={
          <ProtectedRoute><RecipeBook /></ProtectedRoute>
        } />
        <Route path="/recipe/:slug" element={
          <ProtectedRoute><RecipeDetail /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
