// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Token management
export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');
