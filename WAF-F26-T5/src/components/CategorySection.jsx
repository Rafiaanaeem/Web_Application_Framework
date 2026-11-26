
import React from "react";
import NewsCard from "./NewsCard";
import {
  worldNews,
  technologyNews,
  businessNews
} from "../data/newsData";

function CategorySection({ title, news }) {
  return (
    <section className="content-section">
      <h2 className="section-title">{title}</h2>

      <div className="news-grid">
        {news.map((item, index) => (
          <NewsCard news={item} key={index} />
        ))}
      </div>
    </section>
  );
}

export function AdditionalSections() {
  return (
    <>
      <CategorySection title="World News" news={worldNews} />
      <CategorySection title="Technology" news={technologyNews} />
      <CategorySection title="Business" news={businessNews} />
    </>
  );
}

export default CategorySection;
