

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { CiTimer } from "react-icons/ci";
// import { imageMap } from "../utils/imageMap";
// import "../styles/recipeBook.css";

// export default function RecipeBook() {
//   const [recipes, setRecipes] = useState([]);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [cuisine, setCuisine] = useState("All");
//   const [time, setTime] = useState("All");

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("http://localhost:5055/api/recipes")
//       .then(res => res.json())
//       .then(setRecipes)
//       .catch(console.error);
//   }, []);

//   const filteredRecipes = recipes.filter(r =>
//     r.title.toLowerCase().includes(search.toLowerCase()) &&
//     (category === "All" || r.category === category) &&
//     (cuisine === "All" || r.cuisine === cuisine) &&
//     (time === "All" || r.time <= Number(time))
//   );

//   return (
//     <div className="recipebook-page">
//       <h1>My Cookbook</h1>
//       <p>Everything you’ve saved, organized for your next meal.</p>

//       <div className="filters">
//         <input
//           placeholder="What are we craving today?"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//         />

//         <select onChange={e => setCategory(e.target.value)}>
//           <option>All</option>
//           <option>Breakfast</option>
//           <option>Lunch</option>
//           <option>Dinner</option>
//           <option>Snacks</option>
//           <option>Drinks</option>
//         </select>

//         <select onChange={e => setCuisine(e.target.value)}>
//           <option>All</option>
//           <option>Indian</option>
//           <option>Italian</option>
//           <option>Chinese</option>
//           <option>American</option>
//         </select>

//         <select onChange={e => setTime(e.target.value)}>
//           <option value="All">All</option>
//           <option value="10">Under 10 mins</option>
//           <option value="20">Under 20 mins</option>
//           <option value="30">Under 30 mins</option>
//         </select>
//       </div>

//       <div className="recipe-grid">
//         {filteredRecipes.map(recipe => (
//           <div
//             key={recipe._id}
//             className="recipe-card"
//             style={{ backgroundImage: `url(${imageMap[recipe.imageKey]})` }}
//             onClick={() => navigate(`/recipe/${recipe._id}`)}
//           >
//             {/* Category badge */}
//             <span className="badge">{recipe.category}</span>

//             {/* Title – always visible */}
//             <div className="card-title">{recipe.title}</div>

//             {/* Hover-only content */}
//             <div className="hover-content">
//               <div className="time">
//                 <CiTimer />
//                 <span>{recipe.time} mins</span>
//               </div>

//               <button
//                 className="view-btn"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate(`/recipe/${recipe._id}`);
//                 }}
//               >
//                 View Recipe →
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { CiTimer } from "react-icons/ci";
// import { IoSearch } from "react-icons/io5";

// import { imageMap } from "../utils/imageMap";
// import "../styles/recipeBook.css";

// export default function RecipeBook() {
//   const [recipes, setRecipes] = useState([]);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [cuisine, setCuisine] = useState("All");
//   const [time, setTime] = useState("All");

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("http://localhost:5055/api/recipes")
//       .then(res => res.json())
//       .then(setRecipes)
//       .catch(console.error);
//   }, []);

//   const filteredRecipes = recipes.filter(r =>
//     r.title.toLowerCase().includes(search.toLowerCase()) &&
//     (category === "All" || r.category === category) &&
//     (cuisine === "All" || r.cuisine === cuisine) &&
//     (time === "All" || r.time <= Number(time))
//   );

//   return (
//     <div className="recipebook-page">

//       {/* HEADER */}
//       <div className="recipebook-header">
//         <h1>My Cookbook</h1>
//         <p>Your go-to recipes, all in one place.</p>
//       </div>

//       {/* FILTER BAR */}
//       <div className="filter-bar">
//         <div className="search-box">
//           <IoSearch className="search-icon" />
//           <input
//             placeholder="What are we craving today?"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </div>

//         <select onChange={e => setCategory(e.target.value)}>
//           <option>All</option>
//           <option>Breakfast</option>
//           <option>Lunch</option>
//           <option>Dinner</option>
//           <option>Snacks</option>
//           <option>Drinks</option>
//         </select>

//         <select onChange={e => setCuisine(e.target.value)}>
//           <option>All</option>
//           <option>Indian</option>
//           <option>Italian</option>
//           <option>Chinese</option>
//           <option>American</option>
//         </select>

//         <select onChange={e => setTime(e.target.value)}>
//           <option value="All">All</option>
//           <option value="10">Under 10 mins</option>
//           <option value="20">Under 20 mins</option>
//           <option value="30">Under 30 mins</option>
//           <option value="30">Under 40 mins</option>
//           <option value="30">Under 50 mins</option>
//         </select>
//       </div>

//       {/* GRID */}
//       <div className="recipe-grid">
//         {filteredRecipes.map(recipe => (
//           <div
//             key={recipe._id}
//             className="recipe-card"
//             style={{ backgroundImage: `url(${imageMap[recipe.imageKey]})` }}
//             onClick={() => navigate(`/recipe/${recipe._id}`)}
//           >
//             <span className="badge">{recipe.category}</span>

//             <div className="card-title">{recipe.title}</div>

//             <div className="hover-content">
//               <div className="time">
//                 <CiTimer />
//                 <span>{recipe.time} mins</span>
//               </div>

//               <button className="view-btn">View Recipe →</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiTimer } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { GiKnifeFork } from "react-icons/gi";

import { imageMap } from "../utils/imageMap";
import "../styles/recipeBook.css";

export default function RecipeBook() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cuisine, setCuisine] = useState("All");
  const [time, setTime] = useState("All");

  const ITEMS_PER_LOAD = 4;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5055/api/recipes")
      .then(res => res.json())
      .then(setRecipes)
      .catch(console.error);
  }, []);

  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || r.category === category) &&
    (cuisine === "All" || r.cuisine === cuisine) &&
    (time === "All" || r.time <= Number(time))
  );

  return (
    <div className="recipebook-page">

    
      <div className="recipebook-header">
        <h1>My Cookbook</h1>
        <p>Your go-to recipes, all in one place.</p>
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

        <select onChange={e => {
          setCategory(e.target.value);
          setVisibleCount(ITEMS_PER_LOAD);
        }}>
          <option>All</option>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snacks</option>
          <option>Drinks</option>
        </select>

        <select onChange={e => {
          setCuisine(e.target.value);
          setVisibleCount(ITEMS_PER_LOAD);
        }}>
          <option>All</option>
          <option>Indian</option>
          <option>Italian</option>
          <option>Chinese</option>
          <option>American</option>
        </select>

        <select onChange={e => {
          setTime(e.target.value);
          setVisibleCount(ITEMS_PER_LOAD);
        }}>
          <option value="All">All</option>
          <option value="10">Under 10 mins</option>
          <option value="20">Under 20 mins</option>
          <option value="30">Under 30 mins</option>
          <option value="40">Under 40 mins</option>
          <option value="50">Under 50 mins</option>
        </select>
      </div>

     
      <div className="recipe-grid">
        {filteredRecipes.slice(0, visibleCount).map(recipe => (
          <div
            key={recipe._id}
            className="recipe-card"
            style={{ backgroundImage: `url(${imageMap[recipe.imageKey]})` }}
            onClick={() => navigate(`/recipe/${recipe._id}`)}
          >
            <span className="badge">{recipe.category}</span>

            <div className="card-title">{recipe.title}</div>

            <div className="hover-content">
              <div className="time">
                <CiTimer />
                <span>{recipe.time} mins</span>
              </div>

              <button className="view-btn">View Recipe →</button>
            </div>
          </div>
        ))}
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
