import { API_BASE_URL, getToken } from '../config/api';

// API Request wrapper
const apiRequest = async (url, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Admin API functions
export const adminAPI = {
  // სტატისტიკა
  getStats: () => apiRequest('/admin/stats'),

  // მომხმარებლები
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users?${queryString}`);
  },

  getUser: (id) => apiRequest(`/admin/users/${id}`),

  banUser: (id) => apiRequest(`/admin/users/${id}/ban`, { method: 'POST' }),

  unbanUser: (id) => apiRequest(`/admin/users/${id}/unban`, { method: 'POST' }),

  setUserRole: (id, role) => apiRequest(`/admin/users/${id}/role`, {
    method: 'POST',
    body: JSON.stringify({ role })
  }),

  // წიგნები
  getBooks: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/books?${queryString}`);
  },

  getBook: (key) => apiRequest(`/admin/books/${key}`),

  createBook: (bookData) => apiRequest('/admin/books', {
    method: 'POST',
    body: JSON.stringify(bookData)
  }),

  updateBook: (key, bookData) => apiRequest(`/admin/books/${key}`, {
    method: 'PATCH',
    body: JSON.stringify(bookData)
  }),

  deleteBook: (key) => apiRequest(`/admin/books/${key}`, { method: 'DELETE' }),

  // კატეგორიები და ავტორები
  getCategories: () => apiRequest('/admin/categories'),
  getAuthors: () => apiRequest('/admin/authors'),

  // აუდიტ ლოგი
  getAuditLog: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/audit?${queryString}`);
  }
};

// ავტორიზაცია
export const authAPI = {
  login: (credentials) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }).then(res => res.json())
};

// ძირითადი წიგნების API (ჩვეულებრივი მომხმარებლებისთვის)
export const booksAPI = {
  // ყველა წიგნი
  getBooks: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/books?${queryString}`);
  },

  // კონკრეტული წიგნი
  getBook: (key) => apiRequest(`/books/${key}`),

  // ძებნა
  searchBooks: (query, params = {}) => {
    const allParams = { q: query, ...params };
    const queryString = new URLSearchParams(allParams).toString();
    return apiRequest(`/books?${queryString}`);
  }
};