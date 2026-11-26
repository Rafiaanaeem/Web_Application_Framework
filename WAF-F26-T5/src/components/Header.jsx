
import React from "react";

function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-box">W</span>
          <span>WORLDLINE</span>
          <small>NEWS</small>
        </div>

        <div className="header-search">
          <input type="text" placeholder="Search news..." />
          <button aria-label="Search">⌕</button>
        </div>

        <div className="header-actions">
          <button className="signin-btn">Sign In</button>
          <button className="register-btn">Register</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
