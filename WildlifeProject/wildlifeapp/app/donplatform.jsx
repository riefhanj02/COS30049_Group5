import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ImageBackground, Alert } from 'react-native';
import axios from 'axios';
import styles from '../styles/don.style';
import backgroundImage from '../assets/background.jpg';

const DonationPlatform = () => {
  const [donationInfo, setDonationInfo] = useState({
    email: '',
    amount_myr: '',
    purpose: '',
    comments: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const validateFields = () => {
    const { email, amount_myr, purpose } = donationInfo;

    if (!email || !amount_myr || !purpose) {
      setErrorMessage('Email, donation amount, and purpose are required.');
      return false;
    }

    if (isNaN(amount_myr) || Number(amount_myr) <= 0) {
      setErrorMessage('Please enter a valid donation amount.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleDonate = async () => {
    if (!validateFields()) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(
        'http://192.168.0.112:3000/donations',
        donationInfo,
        { timeout: 10000 }
      );

      setSuccessMessage('Thank you for your donation!');
      setDonationInfo({
        email: '',
        amount_myr: '',
        purpose: '',
        comments: '',
      });
    } catch (err) {
      console.error('Error making donation:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMessage(err.response.data.error);
      } else if (err.code === 'ECONNABORTED') {
        setErrorMessage('Request timed out. Please check your network connection.');
      } else {
        setErrorMessage('Failed to process donation. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.headerTitle}>Make a Donation</Text>

          <TextInput
            placeholder="Email"
            style={styles.input}
            value={donationInfo.email}
            onChangeText={(text) => setDonationInfo({ ...donationInfo, email: text })}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Amount in MYR"
            style={styles.input}
            value={donationInfo.amount_myr}
            onChangeText={(text) => setDonationInfo({ ...donationInfo, amount_myr: text })}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Purpose of Donation"
            style={styles.input}
            value={donationInfo.purpose}
            onChangeText={(text) => setDonationInfo({ ...donationInfo, purpose: text })}
          />
          <TextInput
            placeholder="Comments (Optional)"
            style={[styles.input, styles.commentsInput]}
            value={donationInfo.comments}
            onChangeText={(text) => setDonationInfo({ ...donationInfo, comments: text })}
            multiline
          />

          {loading ? (
            <ActivityIndicator size="large" color={styles.loadingIndicatorColor.color} />
          ) : (
            <TouchableOpacity style={styles.donateButton} onPress={handleDonate}>
              <Text style={styles.donateButtonText}>Donate Now</Text>
            </TouchableOpacity>
          )}

          {successMessage && (
            <Text style={styles.successMessage}>{successMessage}</Text>
          )}
          {errorMessage && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

export default DonationPlatform;
