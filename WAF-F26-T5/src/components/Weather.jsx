
import React from "react";

function Weather() {
  return (
    <section className="weather-box">
      <h2>Weather</h2>
      <div className="weather-info">
        <span className="weather-icon">☀️</span>
        <div>
          <h3>Islamabad</h3>
          <p>Sunny · 24°C</p>
        </div>
      </div>
      <small>Sample weather information</small>
    </section>
  );
}

export default Weather;
