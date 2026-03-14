
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdAccessTime } from "react-icons/md";
import { imageMap } from "../utils/imageMap";
import "../styles/recipes.css";

const FALLBACK_IMG = "/fallback.png";

function Recipes({ pantry }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRecipes() {
      if (!pantry || pantry.length === 0) {
        setRecipes([]);
        setLoading(false);
        setToast(null); // no pantry → no toast
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pantry }),
        });

        const data = await res.json();

        const sorted = data.sort((a, b) => {
          if (a.canCook !== b.canCook) return b.canCook - a.canCook;
          return a.missingCount - b.missingCount;
        });

        if (!cancelled) {
          setRecipes(sorted);
        
          const cookableCount = sorted.filter(r => r.canCook).length;
          const totalCount = sorted.length;
          
          let toastConfig = null;
        
          if (totalCount === 0) {
            // Nothing matches at all
            toastConfig = {
              type: "warning",
              message: "No recipes match your pantry. Try different ingredients."
            };
          }
          else if (cookableCount === 0) {
            // Recipes exist, but blocked
            toastConfig = {
              type: "info",
              message: "Recipes Not found, ingredients are missing."
            };
          }
          else {
            // At least one recipe is cookable
            toastConfig = {
              type: "success",
              message: `You can cook ${cookableCount} recipe${cookableCount > 1 ? "s" : ""} right now.`
            };
          }
        
          setToast(toastConfig);
          setTimeout(() => setToast(null), 3500);
        }
        
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchRecipes();
    return () => (cancelled = true);
  }, [pantry]);

  return (
    <div className="recipes-page">

      {/* Toast  */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <h1 className="page-title">Recipes you can make</h1>

      {loading && <p className="page-subtitle">Check your pantry...</p>}
      {!loading && recipes.length === 0 && (
        <p className="page-subtitle">No recipes found.</p>
      )}

      <div className="recipe-grid">
        {recipes.map(recipe => {
          const imgSrc = imageMap[recipe.imageKey] || FALLBACK_IMG;

          return (
            <div
              key={recipe._id}
              className={`recipe-card-new ${
                recipe.canCook ? "ready-card" : "missing-card"
              }`}
            >
              <span className="recipe-category">{recipe.category}</span>

              <img
                src={imgSrc}
                alt={recipe.title}
                className="recipe-image"
                onError={e => (e.currentTarget.src = FALLBACK_IMG)}
              />

              <div className="recipe-content">
                <div className="recipe-title-row">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  <span className={`match-badge ${
                    recipe.matchPercent === 100 ? "match-green"
                    : recipe.matchPercent >= 50  ? "match-yellow"
                    : "match-red"
                  }`}>
                    {recipe.matchPercent}%
                  </span>
                </div>

                <div className="recipe-time">
                  <MdAccessTime />
                  <span>{recipe.time} mins</span>
                </div>

                {recipe.canCook ? (
                  <p className="recipe-status ready">READY TO COOK</p>
                ) : (
                  <p className="recipe-status missing">
                    Missing {recipe.missingCount} ingredient
                    {recipe.missingCount > 1 ? "s" : ""}
                  </p>
                )}

                <Link
                  to={`/recipe/${recipe.imageKey}`}
                  className={`cook-btn ${
                    recipe.canCook ? "" : "disabled-btn"
                  }`}
                >
                  {recipe.canCook ? "Let's Prepare →" : "View Recipe →"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Recipes;
