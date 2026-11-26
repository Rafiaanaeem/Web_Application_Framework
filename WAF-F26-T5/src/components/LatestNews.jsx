
import React from "react";
import { latestNews } from "../data/newsData";

function LatestNews() {
  return (
    <section className="latest-panel">
      <h2 className="section-title">Latest News</h2>

      {latestNews.map((news, index) => (
        <article className="latest-item" key={index}>
          <span className="news-time">{news.time}</span>
          <h3>{news.title}</h3>
          <p>{news.description}</p>
        </article>
      ))}
    </section>
  );
}

export default LatestNews;
