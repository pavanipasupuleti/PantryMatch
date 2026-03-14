import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="nav-logo">PantryMatch</div>

      {user && (
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/recipes">Match</NavLink>
          <NavLink to="/recipe-book">Recipe Book</NavLink>
        </div>
      )}

      {user && (
        <div className="nav-user">
          <span className="nav-username">Hi, {user.name.split(" ")[0]}</span>
          <button className="nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
