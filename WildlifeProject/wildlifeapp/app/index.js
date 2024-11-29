import { useState } from 'react';
import { View, SafeAreaView, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS, icons, images, SIZES } from '../constants';
import { ScreenHeaderBtn, Welcome } from '../components';

const Home = () => {
  const router = useRouter();

  // Function to handle the navigation to the Profile screen
  const handleProfileNavigation = () => {
    router.push('/profile'); // Navigate to the Profile screen
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" />
          ),
          headerRight: () => (
            // Added navigation functionality to profile button
            <ScreenHeaderBtn 
              iconUrl={images.profile} 
              dimension="100%" 
              onPress={handleProfileNavigation} 
            />
          ),
          headerTitle: "",
        }}
      />
      <FlatList
        ListHeaderComponent={<Welcome />}
        data={[]}
        renderItem={null}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Home;
