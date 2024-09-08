import React, { useState,useEffect,useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { loginContext } from "../App";

const Navbar = ({isPicChanged}) => {
  const { isLoggedIn,setIsLoggedIn,auth,setAuth } = useContext(loginContext);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("User");
  const [pageRef, setPageRef] = useState(true);
  const [userProfile, setUserProfile] = useState("https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png");

  // State for hamburger menu
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);
  const closeMenu = () => setShowMenu(false);

  const handleSignout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
    closeMenu();
  }
  useEffect(()=>{
  if (localStorage.getItem("is_authenticated")){
    setUserName(localStorage.getItem('first_name'));
    if (localStorage.getItem('profilepic')){
      setUserProfile(`${import.meta.env.VITE_BASE_URL}${localStorage.getItem('profilepic')}`);
    }
  }
  },[isPicChanged]);
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-3" style={{ height: '80px' }}>
        {/* Logo */}
        <Link className="navbar-brand fs-4" to="/">
          <b>Eventique</b>
        </Link>

        {/* Center Search Bar */}
        <form className="d-flex mx-auto" style={{ width: '40%' }}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search events..."
            aria-label="Search"
            style={{ height: '45px' }}
          />
          <button className="btn btn-outline-success" type="submit" style={{ height: '45px' }}>
            Search
          </button>
        </form>

        {/* Right Side: Conditional rendering based on authentication */}
        <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <>
              {/* Profile image and user's name */}
              <Link to="/profile" className="d-flex align-items-center btn">
                <img
                  src={userProfile}
                  alt="User profile"
                  className="rounded-circle border me-2"
                  width="45"
                  height="45"
                  style={{ borderColor: '#007bff', borderWidth: '2px' }}
                />
                <span className="fs-5 me-3">Hi, {userName}</span>
              </Link>

              {/* Hamburger Menu */}
              <button className="btn btn-outline-primary" onClick={toggleMenu} style={{ height: '45px' }}>
                <i className="fas fa-bars"></i>
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="btn btn-outline-primary me-2 fs-5" style={{ height: '45px' }}>
                Sign In
              </Link>
              <Link to="/sign-up" className="btn btn-primary fs-5" style={{ height: '45px' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Offcanvas Menu (Hamburger Menu) */}
      {showMenu && (
        <div className="offcanvas offcanvas-end show" style={{ visibility: 'visible', backgroundColor: '#f8f9fa' }}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Menu</h5>
            <button type="button" className="btn-close text-reset" onClick={closeMenu}></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav flex-column">
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={closeMenu}>
                  <i className="fas fa-home me-2"></i>Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={closeMenu}>
                  <i className="fas fa-user me-2"></i>Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/my-bookings" className="nav-link" onClick={closeMenu}>
                  <i className="fas fa-calendar-check me-2"></i>My Bookings
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/my-events" className="nav-link" onClick={closeMenu}>
                  <i className="fas fa-calendar-alt me-2"></i>My Events
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/create-event" className="nav-link" onClick={closeMenu}>
                  <i className="fas fa-plus-circle me-2"></i>Create Event
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={handleSignout}>
                  <i className="fas fa-right-from-bracket me-2"></i>Sign Out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
