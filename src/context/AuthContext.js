import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((data) => {
    if (data?.token) localStorage.setItem('token', data.token);
    const { token, ...userData } = data;
    const stored = { ...userData, token: data.token };
    localStorage.setItem('user', JSON.stringify(stored));
    setUser(stored);
    return stored;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      authAPI.getProfile()
        .then(({ data }) => {
          const current = JSON.parse(localStorage.getItem('user') || '{}');
          persistUser({ ...current, ...data, token });
        })
        .catch(() => {});
    }
    setLoading(false);
  }, [persistUser]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    return persistUser(data);
  };

  const register = async (name, email, password, phone) => {
    const { data } = await authAPI.register({ name, email, password, phone });
    return persistUser(data);
  };

  const updateUser = (data) => persistUser({ ...user, ...data, token: user?.token || localStorage.getItem('token') });

  const refreshProfile = async () => {
    const { data } = await authAPI.getProfile();
    const token = localStorage.getItem('token');
    return persistUser({ ...data, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUser,
      refreshProfile,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
