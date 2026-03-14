import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { user, isGuest, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-logo">PantryMatch</div>

      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/recipes">Match</NavLink>
        <NavLink to="/recipe-book">Recipe Book</NavLink>
      </div>

      <div className="nav-user">
        {user ? (
          <>
            <span className="nav-username">Hi, {user.name.split(" ")[0]}</span>
            <button className="nav-logout" onClick={logout}>Logout</button>
          </>
        ) : isGuest ? (
          <>
            <span className="nav-guest-label">Guest</span>
            <button className="nav-logout" onClick={logout}>Sign In</button>
          </>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
