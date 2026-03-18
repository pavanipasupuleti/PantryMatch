
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiTimer } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { GiKnifeFork } from "react-icons/gi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineBookmarkBorder } from "react-icons/md";

import { imageMap } from "../utils/imageMap";
import "../styles/recipeBook.css";

export default function RecipeBook() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cuisine, setCuisine] = useState("All");
  const [time, setTime] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  const [animatingId, setAnimatingId] = useState(null);
  const [favourites, setFavourites] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("pm_favourites") || "[]"));
    } catch {
      return new Set();
    }
  });

  const ITEMS_PER_LOAD = 8;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/recipes`)
      .then(res => res.json())
      .then(setRecipes)
      .catch(console.error);
  }, []);

  function toggleFavourite(e, id) {
    e.stopPropagation();
    setAnimatingId(id);
    setTimeout(() => setAnimatingId(null), 400);
    setFavourites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("pm_favourites", JSON.stringify([...next]));
      return next;
    });
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setVisibleCount(ITEMS_PER_LOAD);
  }

  const showFavourites = activeTab === "saved";

  const filteredRecipes = recipes
    .filter(r => (showFavourites ? favourites.has(r._id) : true))
    .filter(r =>
      (r.title.toLowerCase().includes(search.toLowerCase()) ||
        (r.ingredients || []).some(i =>
          i.toLowerCase().includes(search.toLowerCase())
        )) &&
      (category === "All" || r.category === category) &&
      (cuisine === "All" || r.cuisine === cuisine) &&
      (time === "All" || r.time <= Number(time))
    );

  return (
    <div className="recipebook-page">

      {/* HEADER */}
      <div className="recipebook-header">
        <div className="recipebook-title-wrap">
          <h1 className="recipebook-title">Recipe Book</h1>
          <p className="recipebook-subtitle">Browse, save and cook your favourites</p>
        </div>

        {/* TAB TOGGLE */}
        <div className="tab-toggle">
          <button
            className={`tab-btn ${activeTab === "all" ? "tab-active" : ""}`}
            onClick={() => switchTab("all")}
          >
            <GiKnifeFork className="tab-icon" />
            All Recipes
          </button>
          <button
            className={`tab-btn ${activeTab === "saved" ? "tab-active" : ""}`}
            onClick={() => switchTab("saved")}
          >
            <FaHeart className="tab-icon" />
            Saved Recipes
            {favourites.size > 0 && (
              <span className="tab-badge">{favourites.size}</span>
            )}
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="search-box">
          <IoSearch className="search-icon" />
          <input
            placeholder="Search recipes or ingredients…"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setVisibleCount(ITEMS_PER_LOAD);
            }}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Meal Type</label>
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setVisibleCount(ITEMS_PER_LOAD); }}
          >
            <option value="All">All</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
            <option value="Drinks">Drinks</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Cuisine</label>
          <select
            value={cuisine}
            onChange={e => { setCuisine(e.target.value); setVisibleCount(ITEMS_PER_LOAD); }}
          >
            <option value="All">All</option>
            <option value="Indian">Indian</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
            <option value="American">American</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Cooking Time</label>
          <select
            value={time}
            onChange={e => { setTime(e.target.value); setVisibleCount(ITEMS_PER_LOAD); }}
          >
            <option value="All">Any Time</option>
            <option value="10">Under 10 mins</option>
            <option value="20">Under 20 mins</option>
            <option value="30">Under 30 mins</option>
            <option value="40">Under 40 mins</option>
            <option value="50">Under 50 mins</option>
          </select>
        </div>
      </div>

      {/* RESULTS COUNT */}
      {filteredRecipes.length > 0 && (
        <p className="results-count">
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* EMPTY STATE */}
      {filteredRecipes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            {showFavourites ? <FaHeart /> : <MdOutlineBookmarkBorder />}
          </div>
          <h3 className="empty-title">
            {showFavourites ? "No saved recipes yet" : "No recipes found"}
          </h3>
          <p className="empty-msg">
            {showFavourites
              ? "Tap the heart on any recipe to save it here for quick access."
              : "Try adjusting your search or filters to find something delicious."}
          </p>
          {showFavourites && (
            <button className="empty-cta" onClick={() => switchTab("all")}>
              Browse All Recipes
            </button>
          )}
        </div>
      )}

      {/* GRID */}
      <div className="recipe-grid">
        {filteredRecipes.slice(0, visibleCount).map((recipe, idx) => {
          const isFav = favourites.has(recipe._id);
          const isAnimating = animatingId === recipe._id;
          return (
            <div
              key={recipe._id}
              className="recipe-card"
              style={{
                backgroundImage: `url(${imageMap[recipe.imageKey]})`,
                animationDelay: `${idx * 0.06}s`,
              }}
              onClick={() => navigate(`/recipe/${recipe.imageKey}`)}
            >
              <span className="badge">{recipe.category}</span>

              <button
                className={`bookmark-btn ${isFav ? "bookmarked" : ""}`}
                onClick={e => toggleFavourite(e, recipe._id)}
                title={isFav ? "Remove from favourites" : "Save to favourites"}
              >
                <span className={`heart-icon ${isAnimating ? "heart-pop" : ""}`}>
                  {isFav ? <FaHeart /> : <FaRegHeart />}
                </span>
              </button>

              <div className="card-title">{recipe.title}</div>

              <div className="hover-content">
                <div className="time">
                  <CiTimer />
                  <span>{recipe.time} mins</span>
                </div>
                <button className="view-btn">View Recipe →</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SHOW MORE */}
      {visibleCount < filteredRecipes.length && (
        <div className="show-more-wrapper">
          <button
            className="show-more-btn"
            onClick={() => setVisibleCount(v => v + ITEMS_PER_LOAD)}
          >
            <GiKnifeFork className="show-more-icon" />
            Show More Recipes
          </button>
        </div>
      )}
    </div>
  );
}
