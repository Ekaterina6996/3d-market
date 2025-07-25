import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${process.env.REACT_APP_AUTH_URL}/login`, {
      email, password
    });
    
    const userData = { 
      ...response.data, 
      email 
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (data: any) => {
    const response = await axios.post(`${process.env.REACT_APP_AUTH_URL}/register`, data);
    
    const userData = { 
      ...response.data, 
      email: data.email,
      role: data.role
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};