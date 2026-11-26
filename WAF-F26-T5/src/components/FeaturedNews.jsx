
import React from "react";
import { featuredNews } from "../data/newsData";

function FeaturedNews() {
  return (
    <section className="featured-panel">
      <h2 className="section-title">Top Story</h2>

      <article className="featured-article">
        <img
          src={featuredNews.image}
          alt="Featured world news"
        />

        <span className="category-label">
          {featuredNews.category}
        </span>

        <h1>{featuredNews.title}</h1>

        <p>{featuredNews.description}</p>

        <small>{featuredNews.time}</small>
      </article>
    </section>
  );
}

export default FeaturedNews;
