import React, { createContext, useState, useEffect } from 'react';
import { getToken, removeToken } from '../services/authStorge';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkToken = async () => {
    try {
      const token = await getToken();
      setUserToken(token);
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token) => {
    setUserToken(token);
  };

  const logout = async () => {
    await removeToken();
    setUserToken(null);
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};