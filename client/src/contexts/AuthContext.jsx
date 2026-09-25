import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('questboard_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [levelUpData, setLevelUpData] = useState(null);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.user);
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid token:', err.message);
          logout();
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('questboard_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('questboard_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('questboard_token');
    setToken(null);
    setUser(null);
  };

  const updateUserMetrics = (newUserData) => {
    setUser((prev) => (prev ? { ...prev, ...newUserData } : prev));
  };

  const triggerLevelUp = (levelData) => {
    setLevelUpData(levelData);
  };

  const clearLevelUp = () => {
    setLevelUpData(null);
  };

  const refreshUser = async () => {
    const currentToken = token || localStorage.getItem('questboard_token');
    if (currentToken) {
      try {
        const res = await api.get('/auth/me');
        if (res && res.user) {
          setUser(res.user);
          return res.user;
        }
      } catch (err) {
        console.warn('[AuthContext] refreshUser failed:', err.message);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        logout,
        updateUserMetrics,
        refreshUser,
        levelUpData,
        triggerLevelUp,
        clearLevelUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
