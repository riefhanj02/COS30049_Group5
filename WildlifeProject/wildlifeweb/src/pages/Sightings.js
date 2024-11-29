// src/pages/Sightings.js
import React from 'react';
import '../styles/Sightings.css'; // Import the CSS file for styling
import sightingsImage from '../assets/sighting.jpg'; // Replace with your image
import mapImage from '../assets/map.jpg'; // Replace with a sample map image
import backgroundImage from '../assets/background.jpg';

function Sightings() {
  return (
    <div  style={{ backgroundImage: `url(${backgroundImage})` }}>
    <div className="sightings-wrapper">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Wildlife Monitoring</h1>
        <p>Real-time updates on wildlife sightings and conservation efforts.</p>


      {/* Sightings Info Section */}
      <div className="sightings-container">
        <div className="info-section">
          <h2 className="section-title">Recent Sightings</h2>
          <div className="sightings-grid">
            <div className="sighting-card">
              <img src={sightingsImage} alt="Orangutan Sighting" className="sighting-image" />
              <h3>Orangutan Spotted</h3>
              <p>📍 Location: Borneo Rainforest</p>
              <p>📅 Date: 23rd November 2024</p>
            </div>
            <div className="sighting-card">
              <img src={sightingsImage} alt="Rare Bird Sighting" className="sighting-image" />
              <h3>Orangutan Spotted</h3>
              <p>📍 Location: Sumatran Forest</p>
              <p>📅 Date: 22nd November 2024</p>
            </div>
            <div className="sighting-card">
              <img src={sightingsImage} alt="Elephant Herd" className="sighting-image" />
              <h3>Orangutan Pack Spotted</h3>
              <p>📍 Location: Tapanuli Reserve</p>
              <p>📅 Date: 21st November 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conservation Map Section */}
      <div className="map-section">
        <h2 className="section-title">Conservation Map</h2>
        <p>
          Explore the regions where conservation efforts are actively protecting wildlife.
        </p>
        <img src={mapImage} alt="Conservation Map" className="map-image" />
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h2>Help Us Protect Wildlife</h2>
        <p>Your support helps monitor and conserve wildlife habitats.</p>
        <a href="/Donations" className="cta-button">Donate Now</a>
      </div>
    </div>
    </div>
    </div>
  );
}

export default Sightings;
