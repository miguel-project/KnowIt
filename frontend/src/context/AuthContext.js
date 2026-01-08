import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Crea il Context
const AuthContext = createContext();

// Hook personalizzato per usare il context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato dentro AuthProvider');
  }
  return context;
};

// Provider del Context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controlla se c'è un token salvato al caricamento
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const userData = await api.getProfile();
        setUser(userData);
      } catch (err) {
        console.error('Token non valido:', err);
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  };

  // Registrazione
  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.register(userData);
      
      // Salva token e user
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.login(credentials);
      
      // Salva token e user
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};