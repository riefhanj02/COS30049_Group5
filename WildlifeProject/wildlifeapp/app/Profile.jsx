import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import styles from '../styles/profile.style';
import { images, COLORS } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import backgroundImage from '../assets/background.jpg';

const Profile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId || null;

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setIsLoggedIn(true);
          fetchUserProfile(storedUserId);
        }
      } catch (err) {
        console.error('Error checking login status:', err);
      }
    };
    checkLoginStatus();
  }, []);

  const fetchUserProfile = async (storedUserId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.0.112:3000/userprofile/${storedUserId}`, { timeout: 10000 });
      if (response.status === 200) {
        setUserInfo(response.data);
      } else {
        setError('User profile not found.');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err.message);
      setError('Unable to fetch user profile. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://10.0.2.2:3000/login', { email, password }, { timeout: 10000 });
      if (response.status === 200) {
        const { user } = response.data;
        setUserInfo(user);
        setIsLoggedIn(true);
        await AsyncStorage.setItem('userId', user.id.toString());
        setError(null);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error('Error logging in:', err.message);
      setError('Network error or invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('userId');
      setIsLoggedIn(false);
      setUserInfo(null);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const updatedUserInfo = {
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      gender: userInfo.gender,
      birthday: userInfo.birthday,
      email: userInfo.email,
    };

    setLoading(true);
    try {
      const response = await axios.put(`http://10.0.2.2:3000/userprofile/${userId}`, updatedUserInfo, { timeout: 10000 });
      console.log('Profile updated:', response.data);
      alert('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err.message);
      alert('Failed to update profile. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setUserInfo({ ...userInfo, birthday: formattedDate });
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']} style={styles.gradientOverlay}>
        <ScrollView contentContainerStyle={styles.container}>
          {isLoggedIn && userInfo && (
            <>
              <View style={styles.profileHeader}>
                <Image source={userInfo?.profileImage || images.profile} style={styles.profileImage} />
                <Text style={styles.userName}>
                  {userInfo.first_name} {userInfo.last_name}
                </Text>
              </View>

              <View style={styles.profileDetailsContainer}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                {isEditing ? (
                  <View style={styles.editContainer}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>First Name:</Text>
                      <TextInput
                        style={styles.editInput}
                        value={userInfo.first_name}
                        placeholder="First Name"
                        onChangeText={(text) => setUserInfo({ ...userInfo, first_name: text })}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Last Name:</Text>
                      <TextInput
                        style={styles.editInput}
                        value={userInfo.last_name}
                        placeholder="Last Name"
                        onChangeText={(text) => setUserInfo({ ...userInfo, last_name: text })}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Gender:</Text>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={userInfo.gender}
                          onValueChange={(value) => setUserInfo({ ...userInfo, gender: value })}
                          style={styles.picker}
                        >
                          <Picker.Item label="Select Gender" value="" />
                          <Picker.Item label="Male" value="Male" />
                          <Picker.Item label="Female" value="Female" />
                        </Picker>
                      </View>
                    </View>
                    <Text style={styles.inputLabel}>Birthday:</Text>
                    <TextInput
                      placeholder="Birthday (YYYY-MM-DD)"
                      style={styles.editInput}
                      value={userInfo.birthday}
                      onChangeText={(text) => setUserInfo({ ...userInfo, birthday: text })}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>First Name:</Text>
                      <Text style={styles.detailValue}>{userInfo.first_name}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Last Name:</Text>
                      <Text style={styles.detailValue}>{userInfo.last_name}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Gender:</Text>
                      <Text style={styles.detailValue}>{userInfo.gender}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Birthday:</Text>
                      <Text style={styles.detailValue}>{userInfo.birthday}</Text>
                    </View>
                    <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditing(true)}>
                      <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                  </TouchableOpacity>
                  </>
                )}
              </View>
            </>
          )}

          {!isLoggedIn && (
            <View style={styles.overlayContainer}>
              <Text style={styles.promptText}>Log in or register to view your profile</Text>
              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              <TextInput
                style={styles.editInput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.editInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => router.push('/Register')}
              >
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

export default Profile;
