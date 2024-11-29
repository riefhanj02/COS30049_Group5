import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';
import defaultProfileImage from '../assets/default-profile.jpg'; // Default profile picture
import backgroundImage from '../assets/background.jpg';

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(defaultProfileImage); // Default profile image

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setIsLoggedIn(true);
      fetchUserProfile(storedUserId);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:3000/userprofile/${userId}`);
      setUserInfo(response.data);

      // Set profile image to the provided picture or the default
      setProfileImage(
        response.data.profile_picture
          ? `http://127.0.0.1:3000${response.data.profile_picture}`
          : defaultProfileImage
      );
    } catch (err) {
      setError('Unable to fetch user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userInfo) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('first_name', userInfo.first_name);
      formData.append('last_name', userInfo.last_name);
      formData.append('gender', userInfo.gender);
      formData.append('birthday', userInfo.birthday);
      formData.append('email', userInfo.email);

      // Append profile picture if a new one is selected
      const fileInput = document.getElementById('profile-picture-input');
      if (fileInput.files[0]) {
        formData.append('profile_picture', fileInput.files[0]);
      }

      await axios.put(`http://127.0.0.1:3000/userprofile/${userInfo.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Profile updated successfully!');
      setIsEditing(false);

      // Refresh the profile
      fetchUserProfile(userInfo.id);
    } catch (err) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserInfo(null);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:3000/login', { email, password });
      if (response.status === 200) {
        const { user } = response.data;
        setUserInfo(user);
        setIsLoggedIn(true);
        localStorage.setItem('userId', user.id);

        // Set profile image based on user data
        setProfileImage(
          user.profile_picture ? `http://127.0.0.1:3000${user.profile_picture}` : defaultProfileImage
        );
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Unable to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="background-image" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="profile-wrapper">
        {isLoggedIn && userInfo ? (
          <>
            <div className="profile-header">
              <img src={profileImage} alt="Profile" className="profile-image" />
              <h2>{`${userInfo.first_name} ${userInfo.last_name}`}</h2>
              <p>{userInfo.email}</p>
            </div>
            <div className="profile-details">
              {isEditing ? (
                <>
                  <label>
                    First Name:
                    <input
                      type="text"
                      value={userInfo.first_name}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, first_name: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Last Name:
                    <input
                      type="text"
                      value={userInfo.last_name}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, last_name: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Gender:
                    <select
                      value={userInfo.gender}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, gender: e.target.value })
                      }
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </label>
                  <label>
                    Birthday:
                    <input
                      type="date"
                      value={userInfo.birthday || ''}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, birthday: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Profile Picture:
                    <input type="file" id="profile-picture-input" accept="image/*" />
                  </label>
                  <button onClick={handleUpdateProfile} className="save-button">
                    Save Changes
                  </button>
                  <button onClick={() => setIsEditing(false)} className="cancel-button">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>
                    <strong>First Name:</strong> {userInfo.first_name}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {userInfo.last_name}
                  </p>
                  <p>
                    <strong>Gender:</strong> {userInfo.gender}
                  </p>
                  <p>
                    <strong>Birthday:</strong> {userInfo.birthday}
                  </p>
                  <button onClick={() => setIsEditing(true)} className="edit-button">
                    Edit Profile
                  </button>
                  <button onClick={handleLogout} className="logout-button">
                    Log Out
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="login-container">
            <h2>Log in to your profile</h2>
            {error && <p className="error">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className="login-button">
              Login
            </button>
            <button onClick={() => navigate('/Register')} className="login-button">
              Create an Account
            </button>
            <button onClick={() => navigate('/Admin')} className="login-button">
              Admin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
