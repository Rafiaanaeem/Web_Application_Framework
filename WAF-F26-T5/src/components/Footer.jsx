
import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h2>WORLDLINE NEWS</h2>
          <p>
            Bringing you the latest news, stories and
            developments from around the world.
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <a href="#world">World</a>
          <a href="#technology">Technology</a>
          <a href="#business">Business</a>
        </div>

        <div>
          <h3>Information</h3>
          <a href="#about">About Us</a>
          <a href="mailto:contact@worldlinenews.example">Contact</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms</a>
        </div>

        <div>
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://facebook.com">Facebook</a>
            <a href="https://instagram.com">Instagram</a>
            <a href="https://x.com">X</a>
          </div>
        </div>
      </div>

      <div className="copyright">
        © 2026 WORLDLINE NEWS. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
