import { useEffect, useState, useRef } from "react";
import { CiSearch } from "react-icons/ci";

function IngredientInput({ pantry, setPantry, validIngredients: propIngredients }) {
  const [input, setInput] = useState("");
  const [toast, setToast] = useState(null);
  const [validIngredients, setValidIngredients] = useState(propIngredients || []);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  // Use prop ingredients if provided, otherwise fetch
  useEffect(() => {
    if (propIngredients && propIngredients.length > 0) {
      setValidIngredients(propIngredients);
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/recipes/ingredients/all`)
      .then(res => res.json())
      .then(data => setValidIngredients(data))
      .catch(() => showToast("warning", "Failed to load ingredients"));
  }, [propIngredients]);

  // Compute suggestions on input change
  useEffect(() => {
    const q = input.trim().toLowerCase();
    if (!q) { setSuggestions([]); setOpen(false); return; }
    const matches = validIngredients
      .filter(i => i.includes(q) && !pantry.includes(i))
      .slice(0, 6);
    setSuggestions(matches);
    setOpen(matches.length > 0);
    setActiveIdx(-1);
  }, [input, validIngredients, pantry]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function addIngredient(value) {
    const v = (value || input).trim().toLowerCase();
    if (!v) return;
    if (!validIngredients.includes(v)) {
      showToast("warning", `"${v}" not recognised. Try an ingredient from the recipe book.`);
      setInput(""); setOpen(false); return;
    }
    if (pantry.includes(v)) {
      showToast("info", `"${v}" is already in your pantry`);
      setInput(""); setOpen(false); return;
    }
    setPantry([...pantry, v]);
    setInput(""); setOpen(false);
  }

  function handleKeyDown(e) {
    if (!open) {
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
      setOpen(false);
    }
  }

  return (
    <>
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      <div className="autocomplete-wrapper" ref={wrapperRef}>
        <div className="search-bar">
          <CiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Add an ingredient (e.g., eggs)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            autoComplete="off"
          />
          <button className="add-btn" onClick={() => addIngredient()}>+</button>
        </div>

        {open && (
          <ul className="autocomplete-list">
            {suggestions.map((s, idx) => (
              <li
                key={s}
                className={`autocomplete-item ${idx === activeIdx ? "autocomplete-active" : ""}`}
                onMouseDown={() => addIngredient(s)}
                onMouseEnter={() => setActiveIdx(idx)}
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
