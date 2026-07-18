import { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (email, password) => {
    return api.post('/login', { email, password }).then((response) => {
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
    });
  };

  const logout = () => {
    return api.post('/logout').finally(() => {
      localStorage.removeItem('token');
      setToken(null);
    });
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, estConnecte: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}