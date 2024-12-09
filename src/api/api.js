// api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3003'
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token'); // or 'user_token' if handling both
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication
export const adminSignup = async ({ firstname, lastname, email, username, password, adminType }) => {
  const response = await api.post('/api/admin/signup', {
    firstname,
    lastname,
    email,
    username,
    password,
    adminType,
  });
  return response.data; // return the full response data
};

export const adminLogin = async ({ email, password }) => {
  const response = await api.post('/api/admin/login', { email, password });
  return response.data; // return the full response data
};

// Users
export const getAllUsers = async () => {
  const response = await api.get('/api/users');
  console.log(response.data);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/api/admin/users/getbyid/${userId}`);
  return response.data;
};

export const getAllAdmins = async () => {
  const response = await api.get('/api/admin/all');
  return response.data;
};

export const getNumberOfUsers = async () => {
  const response = await api.get('/api/users/count');
  console.log('Number of Users:', response.data);
  return response.data;
};

export const getNumberOfAdmins = async () => {
  const response = await api.get('/api/admin/users/count');
  console.log('Number of Users:', response.data);
  return response.data;
};

// Todos
export const getAllTodos = async () => {
  const response = await api.get('/api/admin/todos');
  return response.data;
};

export const getAllTodosByUser = async (userId) => {
  const response = await api.get(`/api/admin/todos/user/${userId}`);
  console.log('User Todos:', response.data);
  return response.data;
};

export const getRecentUsers = async () => {
  const response = await api.get('/api/admin/users/recent');
  console.log('Recent Users:', response.data);
  return response.data;
};

export const updateUser = async (userId, updatedData) => {
  const response = await api.put(`/api/users/${userId}`, updatedData);
  return response.data;
};

export const updateAdmin = async (userId, updatedData) => {
  const response = await api.put(`/api/admin/update/${userId}`, updatedData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/api/users/${userId}`);
  return response.data;
};

export default api;
