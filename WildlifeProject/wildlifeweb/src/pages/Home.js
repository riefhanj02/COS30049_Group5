import React, { useState } from 'react';
import '../styles/Home.css';
import backgroundImage from '../assets/background.jpg';
import poacherImage from '../assets/poacher.jpg'; 
import sightingImage from '../assets/sighting.jpg'; 

const Categories = [
  { name: "🐾 Orangutan Sightings", route: "/Sightings" },
  { name: "📜 Wiki", route: "/OrangWiki" },
  { name: "👤 Profile", route: "/profile" },
  { name: "❤️ Donations", route: "/Donations" },
];

const Home = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    // Placeholder for search functionality
    if (searchValue.trim() !== "") {
      alert(`Searching for "${searchValue}"...`);
    }
  };

  return (
    <div
    className="background-image"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="home-wrapper">
      <div className="content-container">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1 className="welcome-title">🌿 Welcome to OrangWiki</h1>
          <p className="welcome-text">
            Explore the wonders of wildlife conservation. Learn about orangutans, their habitat, and efforts to combat poaching.
          </p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search wildlife topics..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="search-input"
            />
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <h2 className="section-title2">Explore Categories</h2>
          <div className="categories-grid">
            {Categories.map((category) => (
              <a href={category.route} key={category.name} className="category-card">
                <p className="category-name">{category.name}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Wildlife Threats Section */}
        <section className="wildlife-threats-section">
          <h2 className="section-title2">The Threat of Poachers</h2>
          <div className="section-content">
            <img src={poacherImage} alt="Poachers" className="section-image" />
            <p>
              Poaching remains one of the biggest threats to wildlife worldwide. 
              Orangutans are particularly vulnerable due to habitat destruction and illegal hunting. 
              Efforts to combat poaching include stronger laws, community involvement, and conservation programs.
            </p>
          </div>
        </section>

        {/* Sightings Section */}
        <section className="sightings-section">
          <h2 className="section-title2">Recent Sightings</h2>
          <div className="section-content">
            <img src={sightingImage} alt="Sightings" className="section-image" />
            <p>
              Wildlife sightings provide valuable data for conservationists. 
              Whether it's a rare orangutan or other species, these moments remind us of the importance of protecting nature.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <h2 className="cta-title">Join the Conservation Effort</h2>
          <p>
            Your actions can make a difference! Consider donating, participating in conservation activities, or spreading awareness to protect wildlife.
          </p>
          <a href="/Donations" className="cta-button">Donate Now</a>
        </section>
      </div>
    </div>
    </div>
  );
};

export default Home;
