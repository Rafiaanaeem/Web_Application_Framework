
import React, { useState } from "react";

function Navbar() {
  const categories = [
    "Home",
    "World",
    "Politics",
    "Business",
    "Technology",
    "Science",
    "Health",
    "Sports",
    "Entertainment"
  ];

  const [active, setActive] = useState("Home");

  return (
    <nav className="navbar">
      <div className="nav-container">
        {categories.map((category) => (
          <a
            href="#"
            key={category}
            className={active === category ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setActive(category);
            }}
          >
            {category}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
