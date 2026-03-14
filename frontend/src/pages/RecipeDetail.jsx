// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "../styles/RecipeDetail.css";

// function RecipeDetail() {
//   const { id } = useParams();
//   const [recipe, setRecipe] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5055/api/recipes/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.steps) {
//           data.steps.sort((a, b) => a.order - b.order);
//         }
//         setRecipe(data);
//       });
      
//   }, [id]);

//   if (!recipe) return <p className="recipe-loading">Loading...</p>;

//   return (
//     <div className="recipe-detail">
//       <h1>{recipe.title}</h1>

//       <h3>Ingredients</h3>
//       <ul>
//         {recipe.ingredients.map((i, idx) => (
//           <li key={idx}>
//             <span>{i.name}</span>
//             <span>{i.quantity}</span>
//           </li>
//         ))}
//       </ul>

//       <h3>Steps</h3>
//       {recipe.steps.map(step => (
//         <div className="step" key={step.order}>
//           <strong>{step.order}. {step.title}</strong>
//           <p>{step.description}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default RecipeDetail;


import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { imageMap } from "../utils/imageMap";

import { MdAccessTime } from "react-icons/md";
import "../styles/RecipeDetail.css";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5055/api/recipes/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.steps) {
          data.steps.sort((a, b) => a.order - b.order);
        }
        setRecipe(data);
      });
  }, [id]);

  if (!recipe) return <p className="recipe-loading">Loading...</p>;

  const pantry = (() => {
    try { return JSON.parse(localStorage.getItem("pm_pantry") || "[]"); }
    catch { return []; }
  })();

  const missingIngredients = recipe.ingredients.filter(
    ing => !pantry.includes(ing.name.toLowerCase().trim())
  );

  return (
    <div className="recipe-detail">

      {/* <Link to="/recipes" className="back-link">← Back to Recipes</Link> */}

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
        </div>

        {/* Static image */}
        <img
  src={imageMap[recipe.imageKey]}
  alt={recipe.title}
  className="recipe-image"
/>

      </div>

      {/* Ingredients */}
      <h2 className="section-title">Ingredients</h2>
      <ul className="ingredient-list">
        {recipe.ingredients.map((i, idx) => (
          <li key={idx}>
            <span>{i.name}</span>
            <span>{i.quantity}</span>
          </li>
        ))}
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

      {/* Shopping List */}
      {missingIngredients.length > 0 && (
        <div className="shopping-list">
          <h2 className="section-title">Shopping List</h2>
          <p className="shopping-subtitle">
            {missingIngredients.length} ingredient{missingIngredients.length > 1 ? "s" : ""} not in your pantry
          </p>
          <ul className="shopping-items">
            {missingIngredients.map((ing, idx) => (
              <li key={idx} className="shopping-item">
                <span className="shopping-icon">🛒</span>
                <span className="shopping-name">{ing.name}</span>
                <span className="shopping-qty">{ing.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default RecipeDetail;
