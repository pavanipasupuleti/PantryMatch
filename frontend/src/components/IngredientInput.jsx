

import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

function IngredientInput({ pantry, setPantry }) {
  const [input, setInput] = useState("");
  const [toast, setToast] = useState(null);
  const [validIngredients, setValidIngredients] = useState([]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  // Fetch valid ingredients from backend
  useEffect(() => {
    fetch("http://localhost:5055/api/recipes/ingredients/all")
      .then(res => res.json())
      .then(data => setValidIngredients(data))
      .catch(() => {
        showToast("warning", "Failed to load ingredients");
      });
  }, []);

  const addIngredient = () => {
    const value = input.trim().toLowerCase();
    if (!value) return;

    
    if (!validIngredients.includes(value)) {
      showToast(
        "warning",
        `We couldn’t recognize "${value}". Try ingredients from the recipe book.`
      );
      setInput("");
      return;
    }

    //  Duplicate
    if (pantry.includes(value)) {
      showToast("info", `"${value}" is already added`);
      setInput("");
      return;
    }

    //  Valid
    setPantry([...pantry, value]);
    setInput("");
  };

  return (
    <>
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="search-bar">
        <CiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Add an ingredient (e.g., eggs)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addIngredient()}
        />
        <button className="add-btn" onClick={addIngredient}>+</button>
      </div>
    </>
  );
}

export default IngredientInput;
