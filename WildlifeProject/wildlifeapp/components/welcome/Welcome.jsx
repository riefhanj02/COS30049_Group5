import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

import styles from './welcome.style';
import { icons, SIZES, COLORS } from '../../constants';
import backgroundImage from '../../assets/background.jpg';

const Categories = [
  { name: "🐾 Animals Sightings", route: "/animalsightings", icon: icons.eye },
  { name: "📜 Animals Biodata", route: "/animalsBiodata", icon: icons.book },
  { name: "👤 Profile", route: "/Profile", icon: icons.user },
  { name: "❤️ Donation", route: "/donplatform"},

];

const Welcome = () => {
  const router = useRouter();
  const [activeCategories, setActiveCategories] = useState("Animals Sightings");
  const [searchValue, setSearchValue] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    axios
      .get('http://10.0.2.2:3000/animals') 
      .then((response) => {
        console.log('Response data:', response.data);
        setAnimals(response.data);
      })
      .catch((error) => {
        console.error('Error fetching animals:', error);
        setError('Unable to fetch animals at the moment. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });


    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      setRecentSearches((prevSearches) => {
        const updatedSearches = [searchValue.trim(), ...prevSearches];
        return updatedSearches.slice(0, 5);
      });
      console.log(`Searching for: ${searchValue}`);
    }
  };

  const fadeIn = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Animated.View style={[styles.container, { opacity: fadeIn }]}>
          <Text style={styles.headerTitle}>The WildLife App</Text>

          <View style={styles.searchContainer}>
            <View style={styles.searchWrapper}>
              <TextInput
                style={styles.searchInput}
                value={searchValue}
                onChangeText={(text) => setSearchValue(text)}
                placeholder="Search for activities..."/>
            </View>
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Image source={icons.search} resizeMode="contain" style={styles.searchBtnImage} />
            </TouchableOpacity>
          </View>

          {recentSearches.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <Text style={styles.recentSearchesTitle}>Recent Searches:</Text>
              <FlatList
                data={recentSearches}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => setSearchValue(item)} style={styles.recentSearchItemContainer}>
                    <Text style={styles.recentSearchItem}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => `${item}-${index}`}
                horizontal
                contentContainerStyle={{ paddingHorizontal: SIZES.small }}
              />
            </View>
          )}

          <View style={styles.tabsContainer}>
            <FlatList
              data={Categories}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.tab, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => router.push(item.route)}>
                  <Image source={item.icon} style={styles.tabIcon} />
                  <Text style={styles.tabText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.name}
              horizontal
              contentContainerStyle={{ columnGap: SIZES.small }}
            />
          </View>

          <View style={styles.introductionContainer}>
            <View style={styles.imageWrapper}>
              <Image source={require('../../assets/orangutan2.jpg')} style={styles.animalImage} resizeMode="cover" />
            </View>
            <Animated.View style={[styles.infoContainer, { transform: [{ translateY: animatedValue }] }]}>
              <View style={styles.infoCard}>
                <Text style={[styles.animalInfo]}>Welcome to the WildLife app! Discover the wonders of orangutans, including their species, habitats, and behaviors. Dive deeper into their amazing world.</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={[styles.animalInfo]}>Learn more about orangutans, their daily activities, and their unique characteristics in the "Animals Biodata" section.</Text>
                <TouchableOpacity style={styles.navigationButton} onPress={() => router.push('/animalsBiodata')}>
                  <Text style={styles.navigationButtonText}>Go to Animals Biodata</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.infoCard}>
                <Text style={[styles.animalInfo]}>Watch real-time orangutan sightings and stay updated on the current locations and activities of these amazing creatures.</Text>
                <TouchableOpacity style={styles.navigationButton} onPress={() => router.push('/animalsightings')}>
                  <Text style={styles.navigationButtonText}>View Animal Sightings</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.infoCard}>
                <Text style={[styles.animalInfo]}>You can contribute to the conservation efforts by donating. Help preserve the natural habitat of these critically endangered animals and protect them for future generations.</Text>
                <TouchableOpacity style={styles.navigationButton} onPress={() => router.push('/donplatform')}>
                  <Text style={styles.navigationButtonText}>Donate Now</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Welcome;
