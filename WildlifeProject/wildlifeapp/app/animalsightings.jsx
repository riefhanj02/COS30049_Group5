import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/animalsightings.style';
import { icons, COLORS } from '../constants';
import backgroundImage from '../assets/background.jpg';

const AnimalSightings = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // For now, no loading logic is used.

  const handleCaptureSighting = () => {
    // Placeholder action for camera capture
    console.log('Capture sighting button pressed');
    alert('Camera functionality is coming soon.');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <SafeAreaView>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroText}>Discover Wildlife Sightings</Text>
          </View>

          {/* Page Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Recent Animal Sightings</Text>
          </View>

          {/* Sightings List */}
          <View style={styles.sightingsList}>
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.sightingCard(index % 2 === 0)}>
                <Image
                  source={require('../assets/orangutan2.jpg')}
                  style={styles.sightingImage}
                />
                <Text style={styles.sightingDetails}>Orangutan - Location XYZ</Text>
                <Text style={styles.sightingTime}>Spotted on 2023-11-03, 14:30</Text>
                <TouchableOpacity style={styles.detailButton} onPress={() => alert('More details coming soon!')}>
                  <Text style={styles.detailButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Floating Button for Capturing New Sighting */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleCaptureSighting}>
        <Text style={styles.captureButtonText}>+</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default AnimalSightings;
