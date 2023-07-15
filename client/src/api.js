import axios from 'axios';

const API_URL = 'http://localhost:3005'; 

// Function to get the request config with the authorization token
const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Function to make a POST request to the signup endpoint
export const signup = (name, email, username, password) => {
  return axios.post(`${API_URL}/user/signup`, { name, email, username, password });
};

// Function to make a POST request to the login endpoint
export const login = (email, password) => {
  return axios.post(`${API_URL}/user/login`, { email, password });
};

// Function to make a GET request to fetch user comments
export const getUserComments = (userId) => {
  const token = localStorage.getItem('token');

  return axios.get(`${API_URL}/comment/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOneComment = (commentId) => {
  return axios.get(`${API_URL}/comment/${commentId}`);
};


// Function to make a POST request to add a new comment
export const addComment = async (commentData) => {
  try {
    const response = await axios.post(`${API_URL}/comment`, commentData, getConfig());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to make a DELETE request to delete a comment
export const deleteComment = (commentId) => {
  const token = localStorage.getItem('token');

  return axios.delete(`${API_URL}/comment/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Function to make a PUT request to edit a comment
export const editComment = (commentId, commentData) => {
  const token = localStorage.getItem('token');

  return axios.put(`${API_URL}/comment/${commentId}`, commentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Function to make a POST request to add a reply to a comment
export const addReply = async (commentId, replyData) => {
  try {
    const response = await axios.post(
      `${API_URL}/comment/${commentId}/reply`,
      replyData,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



// Function to make a DELETE request to delete a reply
export const deleteReply = (commentId, replyId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  return axios.delete(`${API_URL}/comment/${commentId}/reply/${replyId}`, config);
};

// Function to make a PUT request to edit a reply
export const editReply = (commentId, replyId, content) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  return axios.put(`${API_URL}/comment/${commentId}/reply/${replyId}`, { content }, config);
};

// Function to make a GET request to fetch all comments
export const getAllComments = () => {
  return axios.get(`${API_URL}/comment`);
};

// Function to make a GET request to fetch the user profile
export const getUserProfile = () => {
  const token = localStorage.getItem('token');

  return axios.get(`${API_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Function to make a PUT request to update the user profile
export const updateUserProfile = (profileData) => {
  const token = localStorage.getItem('token');

  return axios.put(`${API_URL}/user/profile`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get user notifications
export const getUserNotifications = () => {
  return axios.get(`${API_URL}/notifications`, getConfig());
};

// Mark notification as read
export const markNotificationAsRead = (notificationId) => {
  return axios.put(`${API_URL}/notifications/${notificationId}/mark-as-read`, null, getConfig());
};

// Delete notification
export const deleteNotification = (notificationId) => {
  return axios.delete(`${API_URL}/notifications/${notificationId}`, getConfig());
};

// Like a comment
export const likeComment = (commentId) => {
  return axios.post(`${API_URL}/comment/${commentId}/like`, null, getConfig());
};

// Dislike a comment
export const dislikeComment = (commentId) => {
  return axios.post(`${API_URL}/comment/${commentId}/dislike`, null, getConfig());
};

