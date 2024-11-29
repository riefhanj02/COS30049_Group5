import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Donations.css'; // Ensure this CSS file is created for styling
import backgroundImage from '../assets/background.jpg';

const DonationPage = () => {
  const [donationInfo, setDonationInfo] = useState({
    email: '',
    amount_myr: '', // Update field name to match backend
    purpose: '',
    comments: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDonate = () => {
    setLoading(true);
    setErrorMessage(null);

    axios
      .post('http://127.0.0.1:3000/donations', donationInfo) // Update with your backend URL
      .then((response) => {
        console.log('Donation successful:', response.data);
        setSuccessMessage('Thank you for making a difference! 🌍');
        setDonationInfo({
          email: '',
          amount_myr: '',
          purpose: '',
          comments: '',
        });
      })
      .catch((err) => {
        console.error('Error making donation:', err);
        if (err.response && err.response.data && err.response.data.error) {
          setErrorMessage(err.response.data.error);
        } else if (err.code === 'ECONNABORTED') {
          setErrorMessage('Request timed out. Please check your network connection.');
        } else {
          setErrorMessage('We encountered an error. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="background-image"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="scroll-view-content">
        <div className="donation-container">
          <div className="inner-container">
            <h1 className="header-title">🌱 Support Wildlife Conservation</h1>
            <p className="donation-description">
              Your generosity helps us protect endangered species and their habitats.
              Join us in making a positive impact on wildlife preservation.
            </p>

            <input
              type="email"
              placeholder="Your Email Address"
              className="input"
              value={donationInfo.email}
              onChange={(e) => setDonationInfo({ ...donationInfo, email: e.target.value })}
            />
            <input
              type="number"
              placeholder="Donation Amount (MYR)"
              className="input"
              value={donationInfo.amount_myr}
              onChange={(e) => setDonationInfo({ ...donationInfo, amount_myr: e.target.value })}
            />
            <input
              type="text"
              placeholder="Purpose (e.g., Orangutan Rescue)"
              className="input"
              value={donationInfo.purpose}
              onChange={(e) => setDonationInfo({ ...donationInfo, purpose: e.target.value })}
            />
            <textarea
              placeholder="Add a message (Optional)"
              className="comments-input"
              value={donationInfo.comments}
              onChange={(e) => setDonationInfo({ ...donationInfo, comments: e.target.value })}
            ></textarea>

            {loading ? (
              <div className="loading-indicator">Processing your generosity...</div>
            ) : (
              <button className="donate-button" onClick={handleDonate}>
                Donate Now 💖
              </button>
            )}

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="impact-statement">
              <h2>Why Your Support Matters</h2>
              <p>
                Donations directly fund critical efforts like anti-poaching patrols, wildlife
                rehabilitation, and habitat restoration. Together, we can ensure a future
                for endangered species.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
