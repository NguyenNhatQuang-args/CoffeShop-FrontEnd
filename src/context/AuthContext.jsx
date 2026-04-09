import { createContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

function parseJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return {
      email: payload.sub || '',
      role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || '',
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    const resData = res.data;

    if (!resData.success) {
      throw new Error(resData.message || 'Login failed');
    }

    // Backend returns { success, data: { token, refreshToken }, message }
    // Cookies are set automatically by the browser (HttpOnly)
    // Extract user info from JWT payload
    const tokenData = resData.data;
    const parsed = parseJwtPayload(tokenData.token);
    const userData = parsed || { email };

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
