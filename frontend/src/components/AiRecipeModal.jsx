import { useState, useEffect, useCallback } from "react";
import { FiX, FiCheck, FiAlertCircle, FiClock, FiRefreshCw } from "react-icons/fi";
import "../styles/aiModal.css";

export default function AiRecipeModal({ pantry, onClose }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = useCallback(async () => {
    setLoading(true);
    setError("");
    setRecipe(null); // always clear previous recipe before fetching

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pantry }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }

      // Validate the response has required fields
      if (!data.title || !data.ingredients || !data.steps) {
        setError("AI returned an incomplete recipe. Please try again.");
        return;
      }

      setRecipe(data);
    } catch (err) {
      if (err.name === "TypeError") {
        setError("Cannot connect to the server. Make sure the backend is running.");
      } else {
        setError("Failed to generate recipe. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [pantry]);

  // Auto-generate on open
  useEffect(() => {
    generate();
  }, [generate]);

  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="ai-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ai-modal">
        <button className="ai-close" onClick={onClose} title="Close"><FiX /></button>

        <div className="ai-header">
          <span className="ai-badge">✦ AI Generated</span>
          <h2>Recipe For You</h2>
          <p className="ai-subtitle">Based on your pantry ingredients</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="ai-loading">
            <div className="ai-spinner" />
            <p>Crafting your recipe…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="ai-error">
            <FiAlertCircle />
            <p>{error}</p>
            <button className="ai-retry-btn" onClick={generate}>
              <FiRefreshCw /> Try Again
            </button>
          </div>
        )}

        {/* Recipe */}
        {!loading && !error && recipe && (
          <>
            <div className="ai-recipe-title-row">
              <h3 className="ai-recipe-title">{recipe.title}</h3>
              <div className="ai-meta">
                <span><FiClock /> {recipe.time} mins</span>
                <span>{recipe.cuisine}</span>
                <span>{recipe.category}</span>
              </div>
            </div>

            <div className="ai-section">
              <h4 className="ai-section-title">Ingredients</h4>
              <ul className="ai-ingredient-list">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className={`ai-ing ${ing.have ? "ai-have" : "ai-need"}`}>
                    {ing.have
                      ? <FiCheck className="ai-ing-icon" />
                      : <FiAlertCircle className="ai-ing-icon" />
                    }
                    <span>{ing.name}</span>
                    {ing.quantity && <span className="ai-qty">{ing.quantity}</span>}
                    {!ing.have && <span className="ai-need-label">need</span>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="ai-section">
              <h4 className="ai-section-title">Steps</h4>
              <div className="ai-steps">
                {recipe.steps.map(step => (
                  <div className="ai-step" key={step.order}>
                    <div className="ai-step-num">{step.order}</div>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="ai-regen-btn" onClick={generate}>
              <FiRefreshCw /> Generate Another
            </button>
          </>
        )}
      </div>
    </div>
  );
}
