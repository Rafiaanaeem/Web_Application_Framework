
import React, { useState } from "react";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubscribe(e) {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage("Thank you! You have subscribed successfully.");
    setEmail("");
  }

  return (
    <section className="newsletter">
      <div>
        <h2>Stay Informed</h2>
        <p>
          Get the latest headlines and important stories
          delivered to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubscribe}>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Subscribe</button>

        {message && <p className="subscribe-message">{message}</p>}
      </form>
    </section>
  );
}

export default Newsletter;
