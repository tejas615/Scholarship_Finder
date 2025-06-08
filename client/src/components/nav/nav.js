import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import './styles.css';
import profileIcon from './profile-icon.png'; // Make sure the path is correct

function Nav() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const history = useHistory();
  const dropdownRef = useRef(null);

  // Watch for storage changes from other tabs or login/logout
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  // Refresh login state on mount
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setDropdownVisible(false);
    setIsLoggedIn(false);  // Update state
    history.push('/');
  };

  const goToProfile = () => {
    history.push('/profile');
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="nav-main">
      <div className="small"></div>
      <ul className="nav-ul">
        <li className="nav-home">
          <div className="logocontainer">
            <Link to="/">LearnApply</Link>
          </div>
        </li>

        {isLoggedIn && (
          <li className="nav-profile" ref={dropdownRef}>
            <img
              src={profileIcon}
              alt="Profile"
              className="profile-icon"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            />
            {dropdownVisible && (
              <div className="dropdown-menu">
                <div onClick={goToProfile}>My Profile</div>
                <div onClick={handleLogout}>Logout</div>
              </div>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}

export default Nav;
