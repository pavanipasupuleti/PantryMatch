import "../styles/aiModal.css";

export default function AiRecipeModal({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <div className="ai-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={e => e.stopPropagation()}>

        <div className="ai-modal-header">
          <span className="ai-badge">✨ AI Generated</span>
          <button className="ai-close" onClick={onClose}>×</button>
        </div>

        <h2 className="ai-title">{recipe.title}</h2>

        <div className="ai-meta">
          <span>⏱ {recipe.estimatedTime}</span>
          <span>🍳 {recipe.method}</span>
        </div>

        <h3 className="ai-section-title">Ingredients</h3>
        <ul className="ai-ingredients">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="ai-ingredient-item">
              <span className="ai-ing-name">{ing.name}</span>
              <span className="ai-ing-qty">{ing.quantity}</span>
            </li>
          ))}
        </ul>

        <h3 className="ai-section-title">Steps</h3>
        <div className="ai-steps">
          {recipe.steps.map(step => (
            <div key={step.order} className="ai-step">
              <div className="ai-step-num">{step.order}</div>
              <div>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {recipe.note && <p className="ai-note">{recipe.note}</p>}
      </div>
    </div>
  );
}
