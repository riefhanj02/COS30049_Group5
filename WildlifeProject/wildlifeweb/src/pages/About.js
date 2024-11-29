// src/pages/About.js
import React from 'react';
import '../styles/About.css';
import backgroundImage from '../assets/background.jpg'; // Add a background image if desired

function About() {
  return (
    <div
      className="background-image"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="about-container">
        <h1 className="about-title">About the Project</h1>
        <p className="about-intro">
          The <strong>Safeguarding Wildlife and Enhancing Sustainable Tourism in Semenggoh Nature Reserve</strong> project is an initiative dedicated to the conservation of wildlife, especially the endangered Bornean orangutans, while promoting responsible tourism in the Semenggoh Nature Reserve.
        </p>
        <p className="about-intro">
          In collaboration with the <strong>Sarawak Forestry Corporation</strong>, this project aims to address challenges such as inadequate monitoring systems and limited wildlife viewing opportunities for tourists.
        </p>

        <h2 className="section-heading">🌍 Project Goals</h2>
        <ul className="goals-list">
          <li>Develop a comprehensive monitoring system to safeguard orangutan habitats.</li>
          <li>Enhance the tourist experience with accurate, up-to-date wildlife sightings.</li>
          <li>Promote conservation education and responsible tourism practices.</li>
          <li>Incorporate advanced technologies like AI, IoT, and data visualization for wildlife protection.</li>
        </ul>

        <h2 className="section-heading">💡 Our Mission</h2>
        <p className="about-mission">
          Our mission is to create a sustainable and safe environment where wildlife, particularly orangutans, can thrive. We aim to educate visitors on the importance of conservation and encourage active participation in safeguarding Sarawak's natural heritage.
        </p>

        <div className="cta-section">
          <h2>Get Involved</h2>
          <p>Join us in our journey to protect wildlife and promote sustainable tourism.</p>
          <a href="/Donations" className="cta-button">Support Us with a Donation</a>
        </div>
      </div>
    </div>
  );
}

export default About;
