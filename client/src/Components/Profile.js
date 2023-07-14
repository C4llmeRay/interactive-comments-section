import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../api';
import UserComments from './UserComments';


function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

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
        console.error('Error fetching user profile:', error);
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
        
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {user && (
        <div className="user-info">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
        </div>
      )}

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
        <button type="submit">Update</button>
      </form>

      <h3>My Comments</h3>
      <UserComments />
    </div>
  );
}

export default Profile;
