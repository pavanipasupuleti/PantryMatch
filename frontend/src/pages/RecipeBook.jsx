
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiTimer } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { GiKnifeFork } from "react-icons/gi";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { imageMap } from "../utils/imageMap";
import "../styles/recipeBook.css";

export default function RecipeBook() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cuisine, setCuisine] = useState("All");
  const [time, setTime] = useState("All");
  const [showFavourites, setShowFavourites] = useState(false);
  const [favourites, setFavourites] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("pm_favourites") || "[]"));
    } catch {
      return new Set();
    }
  });

  const ITEMS_PER_LOAD = 4;
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
    setFavourites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("pm_favourites", JSON.stringify([...next]));
      return next;
    });
  }

  const filteredRecipes = recipes
    .filter(r => (showFavourites ? favourites.has(r._id) : true))
    .filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || r.category === category) &&
      (cuisine === "All" || r.cuisine === cuisine) &&
      (time === "All" || r.time <= Number(time))
    );

  return (
    <div className="recipebook-page">

      <div className="recipebook-header">
        <div>
          <h1>My Cookbook</h1>
          <p>Your go-to recipes, all in one place.</p>
        </div>
        <button
          className={`fav-tab-btn ${showFavourites ? "fav-tab-active" : ""}`}
          onClick={() => {
            setShowFavourites(v => !v);
            setVisibleCount(ITEMS_PER_LOAD);
          }}
        >
          {showFavourites ? <FaHeart /> : <FaRegHeart />}
          Saved ({favourites.size})
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <IoSearch className="search-icon" />
          <input
            placeholder="What are we craving today?"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setVisibleCount(ITEMS_PER_LOAD);
            }}
          />
        </div>

        <select onChange={e => { setCategory(e.target.value); setVisibleCount(ITEMS_PER_LOAD); }}>
          <option>All</option>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snacks</option>
          <option>Drinks</option>
        </select>

        <select onChange={e => { setCuisine(e.target.value); setVisibleCount(ITEMS_PER_LOAD); }}>
          <option>All</option>
          <option>Indian</option>
          <option>Italian</option>
          <option>Chinese</option>
          <option>American</option>
        </select>

        <select onChange={e => { setTime(e.target.value); setVisibleCount(ITEMS_PER_LOAD); }}>
          <option value="All">All</option>
          <option value="10">Under 10 mins</option>
          <option value="20">Under 20 mins</option>
          <option value="30">Under 30 mins</option>
          <option value="40">Under 40 mins</option>
          <option value="50">Under 50 mins</option>
        </select>
      </div>

      {showFavourites && filteredRecipes.length === 0 && (
        <p className="no-favs-msg">No saved recipes yet. Bookmark recipes to see them here.</p>
      )}

      <div className="recipe-grid">
        {filteredRecipes.slice(0, visibleCount).map(recipe => {
          const isFav = favourites.has(recipe._id);
          return (
            <div
              key={recipe._id}
              className="recipe-card"
              style={{ backgroundImage: `url(${imageMap[recipe.imageKey]})` }}
              onClick={() => navigate(`/recipe/${recipe.imageKey}`)}
            >
              <span className="badge">{recipe.category}</span>

              <button
                className={`bookmark-btn ${isFav ? "bookmarked" : ""}`}
                onClick={e => toggleFavourite(e, recipe._id)}
                title={isFav ? "Remove from favourites" : "Add to favourites"}
              >
                {isFav ? <FaHeart /> : <FaRegHeart />}
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
