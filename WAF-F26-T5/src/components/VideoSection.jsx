
import React from "react";
import { videoNews } from "../data/newsData";
import NewsCard from "./NewsCard";

function VideoSection() {
  return (
    <section className="content-section">
      <h2 className="section-title">Watch the News</h2>
      <div className="news-grid three-columns">
        {videoNews.map((news, index) => (
          <NewsCard news={news} key={index} />
        ))}
      </div>
    </section>
  );
}

export default VideoSection;
