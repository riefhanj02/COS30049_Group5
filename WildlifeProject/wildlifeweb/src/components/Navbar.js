// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // Use a dedicated CSS file for better organization

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">🌿 OrangWiki</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Sightings">Sightings</Link></li>
                <li><Link to="/Profile">Profile</Link></li>
                <li><Link to="/OrangWiki">OrangutanWiki</Link></li>
                <li><Link to="/donations">Donations</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
