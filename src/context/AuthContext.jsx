import { createContext, useCallback, useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

// კონტექსტის შექმნა
export const AuthContext = createContext(null);

// Provider კომპონენტი
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(true);

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

  // მომხმარებლის მოპოვება ტოკენით
  const fetchCurrentUser = useCallback(
    async (token) => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
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
    },
    [refreshToken, refreshAccessToken]
  );

  // აპის ჩატვირთვისას მომხმარებლის შემოწმება
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

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Login failed');

    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);

    await fetchCurrentUser(data.access_token);
  }, [fetchCurrentUser]);

  // რეგისტრაციის ფუნქცია
  const register = useCallback(async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();
    if (!response.ok) throw new Error(responseData.error?.message || 'Registration failed');

    localStorage.setItem('accessToken', responseData.access_token);
    localStorage.setItem('refreshToken', responseData.refresh_token);
    setAccessToken(responseData.access_token);
    setRefreshToken(responseData.refresh_token);

    await fetchCurrentUser(responseData.access_token);
    return responseData;
  }, [fetchCurrentUser]);

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

  // პაროლის შეცვლის ფუნქცია
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Password change failed');
    }

    // Update tokens after password change (backend bumps token version)
    if (data.access_token && data.refresh_token) {
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
    }

    return data; // Return full response including password_score and warnings
  }, [accessToken]);

  // კონტექსტის მნიშვნელობები
  const value = {
    user,
    login,
    register,
    logout,
    changePassword,
    loading,
    accessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
