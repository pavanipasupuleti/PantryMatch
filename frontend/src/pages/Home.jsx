

import { useNavigate } from "react-router-dom";
import IngredientInput from "../components/IngredientInput";
import PantryList from "../components/PantryList";
import { FaLightbulb } from "react-icons/fa6";

function Home({ pantry, setPantry, validIngredients }) {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <h1 className="page-title">Let's raid the fridge.</h1>
      <p className="page-subtitle">Type what you have at home.</p>

      <IngredientInput
        pantry={pantry}
        setPantry={setPantry}
        validIngredients={validIngredients}
      />

      <div className="pantry-section">
        <div className="pantry-header">
          <p className="pantry-title">Your Pantry</p>
          {pantry.length > 0 && (
            <button className="clear-btn" onClick={() => setPantry([])}>
              Clear all
            </button>
          )}
        </div>

        <PantryList pantry={pantry} setPantry={setPantry} />

      </div>

      <button
        className="check-btn"
        disabled={pantry.length === 0}
        onClick={() => navigate("/recipes")}
      >
        Check Recipes →
      </button>

      <div className="pro-tip">
        <FaLightbulb />
        <span>
          <strong>Pro Tip:</strong> Add at least 3 ingredients for better matches
        </span>
      </div>
    </div>
  );
}

export default Home;

