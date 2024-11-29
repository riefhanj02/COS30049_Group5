import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/OrangWiki.css';
import smolorangutan from '../assets/orangutan3.jpg';
import borneanImage from '../assets/borneanorangutan.jpg';
import sumatranImage from '../assets/sumatranorangutan.jpg';
import tapanuliImage from '../assets/tapanuliorangutan.jpg';
import backgroundImage from '../assets/background.jpg';
import borneanVideo from '../assets/bornean-video.mp4';
import sumatranVideo from '../assets/sumatran-video.mp4';
import tapanuliVideo from '../assets/tapanuli-video.mp4';

const OrangWiki = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3000/animals')
      .then((response) => {
        setAnimals(response.data);
      })
      .catch((err) => {
        console.error('Error fetching animals:', err);
        setError('Unable to fetch animals at the moment. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAnimalClick = (animal) => {
    setSelectedAnimal(animal);
    setModalVisible(true);
  };

  const getAnimalVideo = (species) => {
    switch (species) {
      case 'Bornean Orangutan':
        return borneanVideo;
      case 'Sumatran Orangutan':
        return sumatranVideo;
      case 'Tapanuli Orangutan':
        return tapanuliVideo;
      default:
        return null;
    }
  };

  return (
      <div className="background-image" style={{ backgroundImage: `url(${backgroundImage})` }}>
    <div className="scroll-view-content">
      <h1 className="header-title">Orangutan Wikipedia</h1>

      {/* Introduction Section */}
      <div className="intro-container">
        <img src={smolorangutan} alt="Orangutan" className="intro-image" />
        <p className="intro-text">
          Orangutans are fascinating primates found in the rainforests of Southeast Asia. They are critically endangered, and understanding their unique behaviors, habitats, and characteristics is essential for their conservation.
        </p>
      </div>

      {/* Fun Fact Section */}
      <div className="highlight-container">
        <h2 className="highlight-title">Did You Know?</h2>
        <p className="highlight-text">
          Orangutans are the largest tree-dwelling mammals on Earth. They use their long arms to swing from tree to tree and build nests high in the branches to sleep each night.
        </p>
      </div>

      {/* Conservation Efforts Section */}
      <div className="conservation-container">
        <h2 className="highlight-title">Conservation Efforts</h2>
        <p className="highlight-text">
          Conservation organizations are working tirelessly to protect the habitats of orangutans. Efforts include establishing protected areas, reforestation projects, and educating local communities about the importance of wildlife preservation.
        </p>
      </div>

      {/* Diet and Lifestyle Section */}
      <div className="diet-container">
        <h2 className="highlight-title">Diet and Lifestyle</h2>
        <p className="highlight-text">
          Orangutans primarily feed on fruits, but their diet also includes leaves, bark, and insects. They spend most of their time in trees, where they feel safest from predators.
        </p>
      </div>

      {/* Habitats and Adaptations Section */}
      <div className="habitat-container">
        <h2 className="highlight-title">Habitats and Adaptations</h2>
        <p className="highlight-text">
          Found in Borneo and Sumatra, orangutans are uniquely adapted to their rainforest homes. Their long arms and strong fingers allow them to swing effortlessly through the treetops.
        </p>
      </div>

        <h2 className="header-title">Biodata</h2>

        {loading && <p className="loader-container">Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && animals.length === 0 && !error && (
          <p className="no-data-text">No animals available at the moment.</p>
        )}

        {!loading && animals.length > 0 && (
          <div className="carousel-container">
            <div className="animal-list">
              {animals.map((animal) => (
                <div
                  key={animal['Animal ID']}
                  className="animal-card"
                  onClick={() => handleAnimalClick(animal)}
                >
                  <img
                    src={
                      animal.Species === 'Bornean Orangutan'
                        ? borneanImage
                        : animal.Species === 'Sumatran Orangutan'
                        ? sumatranImage
                        : animal.Species === 'Tapanuli Orangutan'
                        ? tapanuliImage
                        : null
                    }
                    alt={animal.Species}
                    className="animal-image"
                  />
                  <p className="animal-name">{animal.Species || 'Unknown Animal'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {modalVisible && selectedAnimal && (
          <div className="modal-container">
            <div className="modal-content">
              <h3 className="modal-title">{selectedAnimal.Species}</h3>
              <video
                src={getAnimalVideo(selectedAnimal.Species)}
                className="modal-video"
                autoPlay
                controls
                loop
              />
              <p className="modal-info">
                <strong>Species:</strong> {selectedAnimal['Species'] || 'No data'}
              </p>
              <p className="modal-info">
                <strong>Scientific Name:</strong> {selectedAnimal['Scientific Name'] || 'No data'}
              </p>
              <p className="modal-info">
                <strong>Location Origin:</strong> {selectedAnimal['Location of Origin'] || 'No data'}
              </p>
              <p className="modal-info">
                <strong>Population Worldwide:</strong> {selectedAnimal['Population Worldwide'] || 'No data'}
              </p>
              <p className="modal-info">
                <strong>Characteristics:</strong> {selectedAnimal['Characteristics'] || 'No data'}
              </p>
              <p className="modal-info">
                <strong>Behavior:</strong> {selectedAnimal['Behavior'] || 'No data'}
              </p>
              <p className="modal-info">
                <strong>Conservation Status:</strong> {selectedAnimal['Conservation Status'] || 'No data'}
              </p>

              <button className="close-button" onClick={() => setModalVisible(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrangWiki;
