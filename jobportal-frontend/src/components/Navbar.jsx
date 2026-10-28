import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const {
    user,
    logout,
    isAuthenticated,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavClass = ({ isActive }) =>
    isActive
      ? "nav-item active-nav-item"
      : "nav-item";

  return (
    <header className="main-header">
      <nav className="navbar">
        <Link to="/" className="brand">
          <div className="brand-icon">
            JP
          </div>

          <div className="brand-text">
            <span>JobPortal</span>
            <strong>Pro</strong>
          </div>
        </Link>

        <div className="nav-links">
          <NavLink
            to="/"
            className={getNavClass}
          >
            Find Jobs
          </NavLink>

          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                className={getNavClass}
              >
                Login
              </NavLink>

              <Link
                to="/register"
                className="nav-register-button"
              >
                Create Account
              </Link>
            </>
          )}

          {isAuthenticated &&
            user?.role === "CANDIDATE" && (
              <>
                <NavLink
                  to="/candidate/dashboard"
                  className={getNavClass}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/saved-jobs"
                  className={getNavClass}
                >
                  Saved Jobs
                </NavLink>

                <NavLink
                  to="/my-applications"
                  className={getNavClass}
                >
                  Applications
                </NavLink>
              </>
            )}

          {isAuthenticated &&
            user?.role === "RECRUITER" && (
              <>
                <NavLink
                  to="/recruiter/dashboard"
                  className={getNavClass}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/recruiter/jobs"
                  className={getNavClass}
                >
                  Manage Jobs
                </NavLink>
              </>
            )}

          {isAuthenticated && (
            <div className="nav-user-section">
              <Link
                to="/account"
                className="nav-account-link"
              >
                <div className="user-avatar">
                  {user?.fullName
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div className="nav-user-details">
                  <strong>
                    {user?.fullName}
                  </strong>

                  <span>
                    {user?.role === "CANDIDATE"
                      ? "Candidate"
                      : "Recruiter"}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;