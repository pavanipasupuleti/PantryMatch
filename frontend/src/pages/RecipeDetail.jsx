import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { imageMap } from "../utils/imageMap";

import { MdAccessTime } from "react-icons/md";
import { FiShare2, FiPrinter, FiShoppingCart } from "react-icons/fi";
import "../styles/RecipeDetail.css";

function RecipeDetail() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [copyToast, setCopyToast] = useState(false);

  // Load pantry from localStorage
  const pantry = (() => {
    try { return JSON.parse(localStorage.getItem("pm_pantry") || "[]"); }
    catch { return []; }
  })();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/recipes/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.steps) data.steps.sort((a, b) => a.order - b.order);
        setRecipe(data);
      });
  }, [slug]);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: recipe.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2500);
    }
  }

  if (!recipe) return <p className="recipe-loading">Loading...</p>;

  // Compute shopping list — ingredients not in pantry
  const shoppingList = recipe.ingredients.filter(
    i => !pantry.includes(i.name.toLowerCase().trim())
  );

  return (
    <div className="recipe-detail">

      {copyToast && (
        <div className="copy-toast">Link copied to clipboard!</div>
      )}

      {/* Header */}
      <div className="recipe-header">
        <div className="recipe-header-text">
          <span className="recipe-badge">{recipe.category}</span>
          <h1>{recipe.title}</h1>

          {recipe.time && (
            <div className="recipe-time">
              <MdAccessTime />
              <span>{recipe.time} mins</span>
            </div>
          )}

          <div className="recipe-actions">
            <button className="action-btn" onClick={handleShare}>
              <FiShare2 /> Share
            </button>
            <button className="action-btn" onClick={() => window.print()}>
              <FiPrinter /> Print
            </button>
          </div>
        </div>

        <img
          src={imageMap[recipe.imageKey]}
          alt={recipe.title}
          className="recipe-image"
        />
      </div>

      {/* Smart Shopping List */}
      {shoppingList.length > 0 && (
        <>
          <h2 className="section-title">
            <FiShoppingCart style={{ verticalAlign: "middle", marginRight: 8 }} />
            Shopping List
            <span className="shopping-count">{shoppingList.length} item{shoppingList.length > 1 ? "s" : ""} needed</span>
          </h2>
          <ul className="shopping-list">
            {shoppingList.map((i, idx) => (
              <li key={idx} className="shopping-item">
                <span className="shopping-name">{i.name}</span>
                <span className="shopping-qty">{i.quantity}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {shoppingList.length === 0 && (
        <div className="all-set-banner">
          You have all the ingredients! Ready to cook.
        </div>
      )}

      {/* Ingredients */}
      <h2 className="section-title">Ingredients</h2>
      <ul className="ingredient-list">
        {recipe.ingredients.map((i, idx) => {
          const have = pantry.includes(i.name.toLowerCase().trim());
          return (
            <li key={idx} className={have ? "ing-have" : "ing-missing"}>
              <span>{i.name}</span>
              <span>{i.quantity}</span>
            </li>
          );
        })}
      </ul>

      {/* Steps */}
      <h2 className="section-title">Steps</h2>
      <div className="steps-list">
        {recipe.steps.map(step => (
          <div className="step-card" key={step.order}>
            <div className="step-number">{step.order}</div>
            <div>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default RecipeDetail;
