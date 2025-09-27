import React, { createContext, useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'https://books-api-7hu5.onrender.com';

// 1. AuthContext-ის ექსპორტი, რათა hook-მა შეძლოს მისი გამოყენება
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
    } catch (error) {
        console.error("Logout failed on server, clearing client-side session anyway.", error);
    } finally {
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Failed to fetch user", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [accessToken, logout]);

  const handleAuthResponse = useCallback(async (data) => {
    setAccessToken(data.access_token);
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    
    const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${data.access_token}` }
    });
    if (meResponse.ok) {
      const userData = await meResponse.json();
      setUser(userData);
    }
  }, []);

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

    const data = await response.json();
    await handleAuthResponse(data);
  }, [handleAuthResponse]);

  const register = useCallback(async (userData) => { 
    console.log('API-ზე რეგისტრაციისთვის იგზავნება:', userData);
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Registration failed');
    }

    const data = await response.json();
    await handleAuthResponse(data);
  }, [handleAuthResponse]);


  const value = { user, accessToken, login, register, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

