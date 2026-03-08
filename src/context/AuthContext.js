// src/context/AuthContext.js
'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      
      // Appel à votre vrai backend Spring Boot
      const response = await axios.post('http://localhost:8080/api/login', {
        username,
        password
      });
      
      const userData = response.data;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      redirectBasedOnRole(userData.role);
      return { success: true };
    } catch (error) {
      console.error('Erreur login:', error);
      return { 
        success: false, 
        error: error.response?.data || 'Nom d\'utilisateur ou mot de passe incorrect'
      };
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (role) => {
    switch(role) {
      case 'MEDECIN':
        router.push('/medecin/dashboard');
        break;
      case 'DIRECTEUR':
        router.push('/directeur/dashboard');
        break;
      case 'DIRECTEUR_NATIONAL':
        router.push('/directeur-national/dashboard');
        break;
      default:
        router.push('/login');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}