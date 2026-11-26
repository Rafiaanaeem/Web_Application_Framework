
import React from "react";

function NewsCard({ news }) {
  return (
    <article className="news-card">
      <img src={news.image} alt={news.title} />
      <div className="news-card-content">
        <h3>{news.title}</h3>
        <p>{news.description}</p>
        {news.duration && (
          <span className="video-duration">
            ▶ {news.duration}
          </span>
        )}
      </div>
    </article>
  );
}

export default NewsCard;
