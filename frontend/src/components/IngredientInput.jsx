import { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

function IngredientInput({ pantry, setPantry, validIngredients = [] }) {
  const [input, setInput] = useState("");
  const [toast, setToast] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapperRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const val = input.trim().toLowerCase();
    if (val.length < 1) { setSuggestions([]); return; }
    const matches = validIngredients
      .filter(i => i.includes(val) && !pantry.includes(i))
      .slice(0, 6);
    setSuggestions(matches);
    setActiveIdx(-1);
  }, [input, validIngredients, pantry]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addIngredient = (value = input) => {
    const val = value.trim().toLowerCase();
    if (!val) return;

    if (!validIngredients.includes(val)) {
      showToast("warning", `"${val}" not recognized. Try from the recipe book.`);
      setInput("");
      setSuggestions([]);
      return;
    }

    if (pantry.includes(val)) {
      showToast("info", `"${val}" is already added`);
      setInput("");
      setSuggestions([]);
      return;
    }

    setPantry([...pantry, val]);
    setInput("");
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) {
      if (e.key === "Enter") addIngredient();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) addIngredient(suggestions[activeIdx]);
      else addIngredient();
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  return (
    <>
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      <div className="search-bar-wrapper" ref={wrapperRef}>
        <div className="search-bar">
          <CiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Add an ingredient (e.g., eggs)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <button className="add-btn" onClick={() => addIngredient()}>+</button>
        </div>

        {suggestions.length > 0 && (
          <ul className="autocomplete-dropdown">
            {suggestions.map((s, idx) => (
              <li
                key={s}
                className={`autocomplete-item${idx === activeIdx ? " active" : ""}`}
                onMouseDown={() => addIngredient(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default IngredientInput;
