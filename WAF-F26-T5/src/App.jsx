
import React from "react";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import LatestNews from "./components/LatestNews";
import FeaturedNews from "./components/FeaturedNews";
import TrendingNews from "./components/TrendingNews";
import VideoSection from "./components/VideoSection";
import { AdditionalSections } from "./components/CategorySection";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <>
      <Header />

      <Navbar />

      <main className="main-container">

        <div className="breaking-news">
          <strong>BREAKING</strong>
          <span>
            Latest global headlines and important developments from around the world.
          </span>
        </div>

        <div className="main-layout">

          <LatestNews />

          <FeaturedNews />

          <TrendingNews />

        </div>

        <VideoSection />

        <AdditionalSections />

        <Newsletter />

      </main>

      <Footer />
    </>
  );
}

export default App;
