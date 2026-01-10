import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, registerUser, loginUser } from '../services/api';

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
        const response = await getCurrentUser();
        if (response.success) {
          setUser(response.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Token non valido:', err);
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  };

  // Registrazione
  const register = async (username, email, password) => {
    try {
      setError(null);
      const response = await registerUser(username, email, password);
      
      if (response.success) {
        // Salva token e user
        localStorage.setItem('token', response.token);
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await loginUser(email, password);
      
      if (response.success) {
        // Salva token e user
        localStorage.setItem('token', response.token);
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};