import React from "react";
import { Link } from "react-router-dom";
import './styles.css';

function Nav() {
  return (
    <div className="nav-main">
      <div className="small"></div>
      <ul className ="nav-ul">
        <li className = "nav-home">
          <div className="logocontainer">
          <Link  to="/">LearnApply</Link>
          </div>
        </li>
        <li className="nav-scholarships">
          <div className="scholarships-container">
            <Link to="/scholarships">Scholarships</Link>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Nav;