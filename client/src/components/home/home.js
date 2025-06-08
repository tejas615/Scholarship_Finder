import React, { useState } from 'react';
import './styles.css';
import searchIcon from '../../images/search_icon.png';
import achieveIcon from '../../images/achieve_icon.png';
import resourcesIcon from '../../images/resources_icon.png';

import Login from '../Login';
import Register from '../Register';

export default function Home() {
  const [showAuth, setShowAuth] = useState(null); // null, 'login', or 'register'

  const handleBack = () => setShowAuth(null);

  if (showAuth === 'login') {
    return <Login onBack={handleBack} />;
  }

  if (showAuth === 'register') {
    return <Register onBack={handleBack} />;
  }

  return (
    <div className="App">
      <div>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
      </div>
      <div className="headline">
        <h2 className="shadow-pop-bl">Applying made easier.</h2>
        <button
          className="getstarted"
          type="button"
          onClick={() => {
            const choice = window.confirm('Click OK to Login, Cancel to Register');
            setShowAuth(choice ? 'login' : 'register');
          }}
        >
          Get Started
        </button>
      </div>
      <section className="content">
        <article className="quicklinks">
          <ul className="icons">
            <li className="search">
              <img src={searchIcon} alt="search" />
              <div className="label">Search through our immense database.</div>
            </li>
            <div className="vl"></div>
            <li className="achieve">
              <img src={achieveIcon} alt="search" />
              <div className="label">Search through our immense database.</div>
            </li>
            <div className="vl2"></div>
            <li className="resources">
              <img src={resourcesIcon} alt="resources" />
              <div className="label">Take advantage of our wide selection of resources.</div>
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
}
