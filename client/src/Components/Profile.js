import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../api';
import UserComments from './UserComments';
import { Link } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    getUserProfile()
      .then((response) => {
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setUsername(response.data.username);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.msg === 'Authentication failed') {
          // User is not logged in, handle accordingly
          setUser(null);
        } else {
          console.error('Error fetching user profile:', error);
        }
      });
  };

  const handleProfileUpdate = (event) => {
    event.preventDefault();
    // Perform validation if needed

    const profileData = {
      name: name,
      email: email,
      username: username,
    };

    updateUserProfile(profileData)
      .then(() => {
        console.log('Profile updated successfully');
        setIsUpdateMode(false);
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  const handleUpdateModeToggle = () => {
    setIsUpdateMode(!isUpdateMode);
  };

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Profile</h2>
        <p>You need to log in to view your profile.</p>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="user-info">
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Username: {user.username}</p>
      </div>

      {!isUpdateMode && (
        <>
          <button onClick={handleUpdateModeToggle}>Update Profile</button>
          <h3>My Comments</h3>
          <UserComments />
        </>
      )}

      {isUpdateMode && (
        <>
          <h3>Update Profile</h3>
          <form onSubmit={handleProfileUpdate}>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button type="submit">Confirm Update</button>
            <button onClick={handleUpdateModeToggle}>Cancel</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Profile;
