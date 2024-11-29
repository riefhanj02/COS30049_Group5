import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Admin.css';

const BASE_URL = 'http://127.0.0.1:3000';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [gpsData, setGpsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGps, setSelectedGps] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersResponse, adminResponse, gpsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/userprofile`), // Fetch all user profiles
        axios.get(`${BASE_URL}/admin/dashboard`), // Fetch admin dashboard data
        axios.get(`${BASE_URL}/gps_data`), // Fetch GPS data
      ]);
      setUsers(usersResponse.data);
      setAdmins(adminResponse.data);
      setGpsData(gpsResponse.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminUpdate = async () => {
    if (!selectedAdmin) return;
    try {
      await axios.put(`${BASE_URL}/admin/dashboard/${selectedAdmin.id}`, selectedAdmin);
      alert('Admin updated successfully!');
      fetchAdminData();
      setSelectedAdmin(null);
    } catch (err) {
      console.error('Error updating admin:', err);
      alert('Failed to update admin. Please check your inputs and try again.');
    }
  };

  const handleUserUpdate = async () => {
    if (!selectedUser) return;
    try {
      await axios.put(`${BASE_URL}/userprofile/${selectedUser.id}`, selectedUser);
      alert('User profile updated successfully!');
      fetchAdminData();
      setSelectedUser(null);
    } catch (err) {
      console.error('Error updating user profile:', err);
      alert('Failed to update user profile. Please check your inputs and try again.');
    }
  };

  const handleGpsUpdate = async () => {
    if (!selectedGps) return;
    try {
      await axios.put(`${BASE_URL}/gps_data/${selectedGps.id}`, selectedGps);
      alert('GPS data updated successfully!');
      fetchAdminData();
      setSelectedGps(null);
    } catch (err) {
      console.error('Error updating GPS data:', err);
      alert('Failed to update GPS data. Please check your inputs and try again.');
    }
  };

  const handleAdminDelete = async (adminId) => {
    try {
      if (window.confirm('Are you sure you want to delete this admin?')) {
        await axios.delete(`${BASE_URL}/admin/dashboard/${adminId}`);
        alert('Admin deleted successfully!');
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error deleting admin:', err);
      alert('Failed to delete admin.');
    }
  };

  if (loading) {
    return <div className="admin-loader">Loading...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {/* User Management Section */}
      <section className="admin-section">
        <h2>User Management</h2>
        <div className="admin-card-container">
          {users.map((user) => (
            <div className="admin-card" key={user.id}>
              <div className="admin-card-header">
                <h3>{user.first_name} {user.last_name}</h3>
                <p>ID: {user.id}</p>
              </div>
              <div className="admin-card-body">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <div className="admin-card-actions">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="admin-edit-btn"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedUser && (
          <div className="admin-modal">
            <h3>Edit User Profile</h3>
            <label>
              First Name:
              <input
                type="text"
                value={selectedUser.first_name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, first_name: e.target.value })
                }
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                value={selectedUser.last_name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, last_name: e.target.value })
                }
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
            </label>
            <button onClick={handleUserUpdate} className="admin-save-btn">
              Save
            </button>
            <button
              onClick={() => setSelectedUser(null)}
              className="admin-cancel-btn"
            >
              Cancel
            </button>
          </div>
        )}
      </section>

      {/* GPS Data Management Section */}
      <section className="admin-section">
        <h2>GPS Data Management</h2>
        <div className="admin-card-container">
          {gpsData.map((gps) => (
            <div className="admin-card" key={gps.id}>
              <div className="admin-card-header">
                <h3>GPS Record #{gps.id}</h3>
              </div>
              <div className="admin-card-body">
                <p><strong>Latitude:</strong> <span className="gps-data-text">{gps.latitude}</span></p>
                <p><strong>Longitude:</strong> <span className="gps-data-text">{gps.longitude}</span></p>
                <div className="admin-card-actions">
                  <button
                    onClick={() => setSelectedGps(gps)}
                    className="admin-edit-btn"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedGps && (
          <div className="admin-modal">
            <h3>Edit GPS Data</h3>
            <label>
              Latitude:
              <input
                type="text"
                value={selectedGps.latitude}
                onChange={(e) =>
                  setSelectedGps({ ...selectedGps, latitude: e.target.value })
                }
              />
            </label>
            <label>
              Longitude:
              <input
                type="text"
                value={selectedGps.longitude}
                onChange={(e) =>
                  setSelectedGps({ ...selectedGps, longitude: e.target.value })
                }
              />
            </label>
            <button onClick={handleGpsUpdate} className="admin-save-btn">
              Save
            </button>
            <button
              onClick={() => setSelectedGps(null)}
              className="admin-cancel-btn"
            >
              Cancel
            </button>
          </div>
        )}
      </section>

      {/* Admin Management Section */}
      <section className="admin-section">
        <h2>Admin Management</h2>
        <div className="admin-card-container">
          {admins.map((admin) => (
            <div className="admin-card" key={admin.id}>
              <div className="admin-card-header">
                <h3>{admin.username}</h3>
                <p>ID: {admin.id}</p>
              </div>
              <div className="admin-card-body">
                <p><strong>Email:</strong> {admin.email}</p>
                <p><strong>Privileges:</strong> {admin.privileges}</p>
                <div className="admin-card-actions">
                  <button
                    onClick={() => setSelectedAdmin(admin)}
                    className="admin-edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleAdminDelete(admin.id)}
                    className="admin-delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedAdmin && (
          <div className="admin-modal">
            <h3>Edit Admin</h3>
            <label>
              Username:
              <input
                type="text"
                value={selectedAdmin.username}
                onChange={(e) =>
                  setSelectedAdmin({ ...selectedAdmin, username: e.target.value })
                }
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={selectedAdmin.email}
                onChange={(e) =>
                  setSelectedAdmin({ ...selectedAdmin, email: e.target.value })
                }
              />
            </label>
            <label>
              Privileges:
              <select
                value={selectedAdmin.privileges}
                onChange={(e) =>
                  setSelectedAdmin({ ...selectedAdmin, privileges: e.target.value })
                }
              >
                <option value="standard">Standard</option>
                <option value="super admin">Super Admin</option>
              </select>
            </label>
            <button onClick={handleAdminUpdate} className="admin-save-btn">
              Save
            </button>
            <button
              onClick={() => setSelectedAdmin(null)}
              className="admin-cancel-btn"
            >
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Admin;
