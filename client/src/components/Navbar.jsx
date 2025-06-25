import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../images/snapchat.avif";
import "./Navbar.css";
function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token");
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img src={Logo} alt="Logo" className="logo" />
          <span className="site-name">SnapBack</span>
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="user-info">
              Welcome, <strong>{user.name}</strong> |
              <span className="badge">{user.badge}</span>
            </span>
            <button className="btn logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn primary">
              Login
            </Link>
            <Link to="/register" className="btn secondary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
