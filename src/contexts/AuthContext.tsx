import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/api/axiosInstance';

// Mock user type to replace Supabase User
interface User {
  id: string;
  email: string;
  role: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  register: (username: string, password: string, role: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('token');

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getToken());

  // Real login function using backend
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', new URLSearchParams({
        username,
        password
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('token', access_token);
      // Fetch user info
      const me = await api.get('/auth/me');
      setUser(me.data);
      toast.success(`Welcome back, ${me.data.role === 'admin' ? 'Admin' : 'Observer'}`);
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.info('You have been logged out');
  };

  // Registration function
  const register = async (username: string, password: string, role: string = 'observer'): Promise<boolean> => {
    try {
      await api.post('/auth/register', { username, password, role });
      toast.success('Registration successful! You can now log in.');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed');
      return false;
    }
  };

  // Check for token on mount and fetch user
  useEffect(() => {
    const token = getToken();
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        });
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, session: null, login, logout, isAdmin, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
