import { createContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    const userData = res.data.data || res.data;
    setUser(userData);
    setIsAuthenticated(true);
    sessionStorage.setItem('admin_user', JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout errors
    }
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
