import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import styles from '../styles/register.style';
import { useRouter } from 'expo-router';
import backgroundImage from '../assets/background.jpg';
import { Picker } from '@react-native-picker/picker';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://192.168.0.112:3000'; // Replace with backend IP for iOS

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    birthday: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const router = useRouter();
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animation for fading in components

  // Fade-in animation
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  
    const { first_name, last_name, gender, birthday, email, password, confirm_password } = userInfo;
  
    // Input Validation
    if (!first_name || !last_name || !gender || !birthday || !email || !password || !confirm_password) {
      setErrorMessage('All fields are required.');
      setLoading(false);
      return;
    }
  
    if (password !== confirm_password) {
      setErrorMessage('Passwords do not match.');
      setLoading(false);
      return;
    }
  
    try {
      console.log('Sending registration request:', userInfo);
  
      // Request payload
      const payload = {
        first_name,
        last_name,
        gender,
        birthday,
        email,
        confirmed_password: password,
      };
  
      const response = await axios.post(`${BASE_URL}/userprofile`, payload, { timeout: 10000 });
  
      if (response.status === 201) {
        console.log('Registration successful:', response.data);
        setSuccessMessage('Registration successful! You can now log in.');
        setUserInfo({
          first_name: '',
          last_name: '',
          gender: '',
          birthday: '',
          email: '',
          password: '',
          confirm_password: '',
        });
      } else {
        setErrorMessage('Failed to create account. Please try again.');
      }
    } catch (err) {
      console.error('Registration Error:', err.message || err);
      setErrorMessage('Unable to complete registration. Check your network connection.');
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

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.innerContainer}
        >
          <Animated.View style={[styles.animatedView, { opacity: fadeAnim }]}>
            <Text style={styles.headerTitle}>Welcome!</Text>
            <Text style={styles.subTitle}>Create your account to get started</Text>

            {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}

            {/* Input Fields */}
            <TextInput
              placeholder="First Name"
              style={styles.input}
              value={userInfo.first_name}
              onChangeText={(text) => setUserInfo({ ...userInfo, first_name: text })}
            />
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              value={userInfo.last_name}
              onChangeText={(text) => setUserInfo({ ...userInfo, last_name: text })}
            />

            {/* Gender Picker */}
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

            <TextInput
            placeholder="Birthday (YYYY-MM-DD)"
            style={styles.input}
            value={userInfo.birthday}
            onChangeText={(text) => setUserInfo({ ...userInfo, birthday: text })}
          />

            {isDatePickerVisible && (
              <DateTimePicker
                value={userInfo.birthday ? new Date(userInfo.birthday) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={handleDateChange}
              />
            )}

            <TextInput
              placeholder="Email"
              style={styles.input}
              value={userInfo.email}
              keyboardType="email-address"
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={userInfo.password}
              onChangeText={(text) => setUserInfo({ ...userInfo, password: text })}
            />
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              secureTextEntry
              value={userInfo.confirm_password}
              onChangeText={(text) => setUserInfo({ ...userInfo, confirm_password: text })}
            />

            {/* Buttons */}
            {loading ? (
              <ActivityIndicator size="large" color={styles.loaderColor} />
            ) : (
              <>
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => router.push('/Profile')}
                >
                  <Text style={styles.loginButtonText}>Back to Login</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </ScrollView>
    </ImageBackground>
  );
};

export default Register;
