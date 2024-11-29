import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  ImageBackground,
  Animated,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import styles from '../styles/animalsBio.style';
import { COLORS } from '../constants';
import smolorangutan from '../assets/orangutan3.jpg';
import borneanImage from '../assets/borneanorangutan.jpg';
import sumatranImage from '../assets/sumatranorangutan.jpg';
import tapanuliImage from '../assets/tapanuliorangutan.jpg';
import backgroundImage from '../assets/background.jpg';
import leftArrow from '../assets/left_arrow_icon.png';
import rightArrow from '../assets/right_arrow_icon.png';

const AnimalsBio = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentScrollOffset, setCurrentScrollOffset] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const itemWidth = 250;

  useEffect(() => {
    axios
      .get('http://192.168.0.112:3000/animals')
      .then((response) => {
        console.log('Animals response:', response.data);
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

  const handleAnimalPress = (animal) => {
    setSelectedAnimal(animal);
    setModalVisible(true);
  };

  const fadeIn = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const scrollLeft = () => {
    if (flatListRef.current) {
      const newOffset = Math.max(currentScrollOffset - itemWidth, 0);
      setCurrentScrollOffset(newOffset);
      flatListRef.current.scrollToOffset({ offset: newOffset, animated: true });
    }
  };

  const scrollRight = () => {
    if (flatListRef.current) {
      const newOffset = currentScrollOffset + itemWidth;
      setCurrentScrollOffset(newOffset);
      flatListRef.current.scrollToOffset({ offset: newOffset, animated: true });
    }
  };

  const closeModal = () => {
    setSelectedAnimal(null);
    setModalVisible(false);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Animated.View style={{ opacity: fadeIn }}>
          <Text style={styles.headerTitle}>The WildLife App</Text>

          <View style={styles.introContainer}>
            <Image source={smolorangutan} style={styles.introImage} resizeMode="cover" />
            <Text style={styles.introText}>
              Orangutans are fascinating primates found in the rainforests of Southeast Asia. They are critically endangered, and understanding their unique behaviors, habitats, and characteristics is essential for their conservation.
            </Text>
            <View style={styles.highlightContainer}>
              <Text style={styles.highlightTitle}>Did You Know?</Text>
              <Text style={styles.highlightText}>
                Orangutans are the largest tree-dwelling mammals on Earth. They use their long arms to swing from tree to tree and build nests high in the branches to sleep each night.
              </Text>
            </View>
          </View>

          <Text style={styles.searchTitle}>Orangutan Biodata</Text>

          {loading && <ActivityIndicator size="large" color={COLORS.primary} style={styles.loaderContainer} />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {!loading && animals.length === 0 && !error && (
            <Text style={styles.noDataText}>No animals available at the moment.</Text>
          )}

          {!loading && animals.length > 0 && (
            <View style={styles.carouselContainer}>
              <TouchableOpacity style={styles.arrowButton} onPress={scrollLeft}>
                <Image source={leftArrow} style={styles.arrowIcon} />
              </TouchableOpacity>

              <FlatList
                ref={flatListRef}
                data={animals}
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.animalCard} onPress={() => handleAnimalPress(item)}>
                    <Image
                      source={
                        item.Species === 'Bornean Orangutan'
                          ? borneanImage
                          : item.Species === 'Sumatran Orangutan'
                          ? sumatranImage
                          : item.Species === 'Tapanuli Orangutan'
                          ? tapanuliImage
                          : null
                      }
                      style={styles.animalImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.animalName}>{item.Species || 'Unknown Animal'}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) =>
                  item['Animal ID'] ? item['Animal ID'].toString() : Math.random().toString()
                }
                contentContainerStyle={{ paddingBottom: 20 }}
              />

              <TouchableOpacity style={styles.arrowButton} onPress={scrollRight}>
                <Image source={rightArrow} style={styles.arrowIcon} />
              </TouchableOpacity>
            </View>
          )}

          {selectedAnimal && (
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{selectedAnimal.Species}</Text>
                  <Image
                    source={
                      selectedAnimal.Species === 'Bornean Orangutan'
                        ? borneanImage
                        : selectedAnimal.Species === 'Sumatran Orangutan'
                        ? sumatranImage
                        : selectedAnimal.Species === 'Tapanuli Orangutan'
                        ? tapanuliImage
                        : null
                    }
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.modalInfo}>
                    Species: {selectedAnimal.Species || 'No description available.'}
                  </Text>
                  <Text style={styles.modalInfo}>
                    Location Origin: {selectedAnimal['Location of Origin'] || 'No description available.'}
                  </Text>
                  <Text style={styles.modalInfo}>
                    Scientific Name: {selectedAnimal['Scientific Name'] || 'No description available.'}
                  </Text>
                  <Text style={styles.modalInfo}>
                    Population Worldwide: {selectedAnimal['Population Worldwide'] || 'No description available.'}
                  </Text>
                  <Text style={styles.modalInfo}>
                    Characteristics: {selectedAnimal['Characteristics'] || 'No description available.'}
                  </Text>
                  <Text style={styles.modalInfo}>
                    Behavior: {selectedAnimal['Behavior'] || 'No description available.'}
                  </Text>
                  <Text style={styles.modalInfo}>
                    Conservation Status: {selectedAnimal['Conservation Status'] || 'No description available.'}
                  </Text>
                  <Pressable style={styles.closeButton} onPress={closeModal}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          )}
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
};

export default AnimalsBio;
