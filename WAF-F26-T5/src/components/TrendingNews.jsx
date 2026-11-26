
import React from "react";
import { trendingNews } from "../data/newsData";
import Weather from "./Weather";

function TrendingNews() {
  return (
    <aside className="trending-panel">
      <h2 className="section-title">Trending</h2>

      <ol className="trending-list">
        {trendingNews.map((news, index) => (
          <li key={index}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{news}</p>
          </li>
        ))}
      </ol>

      <Weather />

      <div className="live-box">
        <span className="live-dot"></span>
        LIVE UPDATES
        <p>Follow the latest breaking news and developments.</p>
      </div>
    </aside>
  );
}

export default TrendingNews;
