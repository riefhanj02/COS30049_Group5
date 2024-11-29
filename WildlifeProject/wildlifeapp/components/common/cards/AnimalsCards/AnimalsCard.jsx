import { View, Text, TouchableOpacity, Image } from 'react-native'

import styles from './animalscard.style'

const AnimalsCard = ({ item, selectedAnimal, handleCardPress }) => {
  return (
    <TouchableOpacity style=
      {styles.container(selectedAnimal, item)}
      onPress={() => handleCardPress(item)}
    >
      <TouchableOpacity style={styles.logoContainer(selectedAnimal, item)}>
        <Image
          source={{ uri: item.employer_logo}}
          resizeMode="contain"
          style={styles.logoImage}
        />
      </TouchableOpacity>
      <Text>{item.animal_name}</Text>
    </TouchableOpacity>
  );
};

export default AnimalsCard;
