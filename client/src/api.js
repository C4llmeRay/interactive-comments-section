import axios from 'axios';

const API_URL = 'http://localhost:3005'; 

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
  return axios.get(`${API_URL}/comment/${userId}`);
};

// Function to make a POST request to add a new comment
export const addComment = (comment) => {
  return axios.post(`${API_URL}/comment`, comment);
};

// Function to make a DELETE request to delete a comment
export const deleteComment = (commentId) => {
  return axios.delete(`${API_URL}/comment/${commentId}`);
};

// Function to make a PUT request to edit a comment
export const editComment = (commentId, content) => {
  return axios.put(`${API_URL}/comment/${commentId}`, { content });
};

// Function to make a POST request to add a reply to a comment
export const addReply = (commentId, reply) => {
  return axios.post(`${API_URL}/comment/${commentId}/reply`, reply);
};

// Function to make a GET request to fetch all comments
export const getAllComments = () => {
  return axios.get(`${API_URL}/comment`);
};
