import React, { createContext, useState, useEffect, useCallback } from 'react';

// API-ს საბაზისო მისამართი
const API_BASE_URL = 'https://books-api-7hu5.onrender.com';

// კონტექსტის შექმნა
export const AuthContext = createContext(null);

// Provider კომპონენტი
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(true);

  // ფუნქცია, რომელიც ამოწმებს მიმდინარე მომხმარებელს ტოკენის მიხედვით
  const fetchCurrentUser = useCallback(async (token) => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        if (response.status === 401 && refreshToken) {
          await refreshAccessToken();
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [/* refreshToken */]);

  // Access Token-ის განახლების ფუნქცია
  const refreshAccessToken = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    if (!currentRefreshToken) return logout();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: currentRefreshToken }),
      });

      if (response.ok) {
        const tokens = await response.json();
        localStorage.setItem('accessToken', tokens.access_token);
        localStorage.setItem('refreshToken', tokens.refresh_token);
        setAccessToken(tokens.access_token);
        setRefreshToken(tokens.refresh_token);
        await fetchCurrentUser(tokens.access_token);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
    }
  }, []);

  // აპლიკაციის პირველად ჩატვირთვისას ვამოწმებთ მომხმარებლის სტატუსს
  useEffect(() => {
    fetchCurrentUser(accessToken);
  }, [accessToken, fetchCurrentUser]);

  // ლოგინის ფუნქცია
  const login = useCallback(async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Login failed');
    }

    const tokens = await response.json();
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('refreshToken', tokens.refresh_token);
    setAccessToken(tokens.access_token);
    setRefreshToken(tokens.refresh_token);
  }, []);

  // რეგისტრაციის ფუნქცია
  const register = useCallback(async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json(); // პასუხს ვპარსავთ ნებისმიერ შემთხვევაში

    if (!response.ok) {
      throw new Error(responseData.error.message || 'Registration failed');
    }
    
    // ვინახავთ ტოკენებს და ვალოგინებთ მომხმარებელს
    localStorage.setItem('accessToken', responseData.access_token);
    localStorage.setItem('refreshToken', responseData.refresh_token);
    setAccessToken(responseData.access_token);
    setRefreshToken(responseData.refresh_token);
    
    // ვაბრუნებთ სრულ პასუხს, რომ მოდალმა გამოიყენოს password_warning
    return responseData;
  }, []);

  // ლოგაუთის ფუნქცია
  const logout = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    if (currentRefreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: currentRefreshToken }),
        });
      } catch (error) {
        console.error('Logout API call failed, clearing session locally.', error);
      }
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  const value = { user, login, register, logout, loading, accessToken };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

