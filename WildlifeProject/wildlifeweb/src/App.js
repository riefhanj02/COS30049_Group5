// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Sightings from './pages/Sightings';
import Profile from './pages/Profile';
import OrangWiki from './pages/OrangWiki';
import Donations from './pages/Donations';
import About from './pages/About';
import Register from './pages/Register';
import Admin from './pages/Admin';
import './App.css'; // Import the CSS file here

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Sightings" element={<Sightings />} />
                    <Route path="/Profile" element={<Profile />} />
                    <Route path="/OrangWiki" element={<OrangWiki />} />
                    <Route path="/donations" element={<Donations />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/Admin" element={<Admin />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
