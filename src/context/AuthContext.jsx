// ========================================
// CONTEXT: Auth Context
// Quản lý trạng thái đăng nhập của Admin
// Pattern: Context + Custom Hook
// ========================================

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  login as loginService,
  logout as logoutService,
  isAuthenticated,
  getToken,
} from "../services/authService";

// Tạo context
const AuthContext = createContext(null);

/**
 * Provider component để wrap app
 * Quản lý authentication state
 */
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Lưu token vào context để dễ dàng access từ các component
  const [token, setToken] = useState(null);

  // Kiểm tra trạng thái đăng nhập khi mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const storedToken = getToken();
      setIsLoggedIn(authenticated);
      setToken(storedToken);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Đăng nhập
   * @param {string} username
   * @param {string} password
   * @returns {Promise<boolean>} true nếu đăng nhập thành công
   */
  const login = useCallback(async (username, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await loginService(username, password);
      // Lưu token vào context state (đã được lưu vào localStorage trong service)
      const storedToken = getToken();
      setToken(storedToken);
      setIsLoggedIn(true);
      return true;
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
      setToken(null);
      setIsLoggedIn(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Đăng xuất
   */
  const logout = useCallback(() => {
    logoutService();
    setIsLoggedIn(false);
    setToken(null);
    setError(null);
  }, []);

  /**
   * Xóa error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    isLoggedIn,
    isLoading,
    error,
    token, // Token được lưu trong context để dễ dàng access
    login,
    logout,
    clearError,
    getToken, // Hàm lấy token từ localStorage (backup)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook để sử dụng auth context
 * @returns {{ isLoggedIn: boolean, isLoading: boolean, error: string, token: string|null, login: Function, logout: Function, clearError: Function, getToken: Function }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
