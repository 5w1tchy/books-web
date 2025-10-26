// 1. ძირითადი API მისამართი
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// ეს არის თქვენი backend-ის ძირითადი URL, რომელიც მოდის .env.local ფაილიდან

// 2. Token-ის მიღების ფუნქცია
const getToken = () => localStorage.getItem('token');
// ამოიღებს ავტორიზაციის token-ს localStorage-დან

// 3. ზოგადი API მოთხოვნის wrapper ფუნქცია
const apiRequest = async (url, options = {}) => {
  const token = getToken();
  
  // ყველა მოთხოვნისთვის საერთო კონფიგურაცია
  const config = {
    headers: {
      'Content-Type': 'application/json', // JSON ფორმატში ვაგზავნით
      ...(token && { 'Authorization': `Bearer ${token}` }), // თუ token არსებობს, ვამატებთ header-ში
      ...options.headers, // დამატებითი header-ები
    },
    ...options, // დამატებითი ოფციები (method, body, და ა.შ.)
  };

  try {
    // HTTP მოთხოვნის გაგზავნა
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    // შეცდომის შემოწმება
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // JSON პასუხის დაბრუნება
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error; // შეცდომის გადაცემა
  }
};

// 4. ადმინის API ფუნქციები
export const adminAPI = {
  
  // ==== სტატისტიკა ====
  getStats: () => apiRequest('/admin/stats'),
  // GET /api/admin/stats - ადმინის დაშბორდის სტატისტიკა
  
  // ==== მომხმარებლების მართვა ====
  
  // მომხმარებლების სიის მიღება (ძებნით, pagination-ით)
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users?${queryString}`);
  },
  // მაგალითად: getUsers({q: 'john', page: 1, size: 20})
  // GET /api/admin/users?q=john&page=1&size=20
  
  // კონკრეტული მომხმარებლის მიღება
  getUser: (id) => apiRequest(`/admin/users/${id}`),
  // GET /api/admin/users/123e4567-e89b-12d3-a456-426614174000
  
  // მომხმარებლის დაბანვა
  banUser: (id) => apiRequest(`/admin/users/${id}/ban`, { method: 'POST' }),
  // POST /api/admin/users/123e4567-e89b-12d3-a456-426614174000/ban
  
  // ბანის მოხსნა
  unbanUser: (id) => apiRequest(`/admin/users/${id}/unban`, { method: 'POST' }),
  // POST /api/admin/users/123e4567-e89b-12d3-a456-426614174000/unban
  
  // მომხმარებლის როლის შეცვლა
  setUserRole: (id, role) => apiRequest(`/admin/users/${id}/role`, {
    method: 'POST',
    body: JSON.stringify({ role }) // {"role": "admin"} ან {"role": "user"}
  }),
  // POST /api/admin/users/123e4567-e89b-12d3-a456-426614174000/role
  
  // ==== წიგნების მართვა ====
  
  // წიგნების სიის მიღება
  getBooks: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/books?${queryString}`);
  },
  // GET /api/admin/books?q=search&category=fiction&page=1&size=20
  
  // კონკრეტული წიგნის მიღება
  getBook: (key) => apiRequest(`/admin/books/${key}`),
  // GET /api/admin/books/book-slug ან /api/admin/books/book-id
  
  // ახალი წიგნის შექმნა
  createBook: (bookData) => apiRequest('/admin/books', {
    method: 'POST',
    body: JSON.stringify(bookData)
  }),
  // POST /api/admin/books
  // Body: {"title": "წიგნის სათაური", "authors": ["ავტორი"], ...}
  
  // წიგნის განახლება (ნაწილობრივ)
  updateBook: (key, bookData) => apiRequest(`/admin/books/${key}`, {
    method: 'PATCH',
    body: JSON.stringify(bookData)
  }),
  // PATCH /api/admin/books/book-id
  
  // წიგნის წაშლა
  deleteBook: (key) => apiRequest(`/admin/books/${key}`, { method: 'DELETE' }),
  // DELETE /api/admin/books/book-id
  
  // ==== კატეგორიები და ავტორები ====
  
  // ყველა კატეგორიის მიღება (autocomplete-ისთვის)
  getCategories: () => apiRequest('/admin/categories'),
  // GET /api/admin/categories
  
  // ყველა ავტორის მიღება (autocomplete-ისთვის)
  getAuthors: () => apiRequest('/admin/authors'),
  // GET /api/admin/authors
  
  // ==== აუდიტ ლოგი ====
  
  // აუდიტ ლოგის მიღება
  getAuditLog: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/audit?${queryString}`);
  }
  // GET /api/admin/audit?page=1&size=20
};

// 5. ავტორიზაციის API
export const authAPI = {
  // ლოგინი
  login: (credentials) => fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials) // {"email": "admin@example.com", "password": "password"}
  }).then(res => res.json())
  // POST /api/auth/login
};