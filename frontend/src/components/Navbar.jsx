import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">PantryMatch</div>

      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/recipes">Match</NavLink>
        <NavLink to="/recipe-book">Recipe Book</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
