// ========================================
// SERVICE: Authentication Service
// Xử lý đăng nhập và quản lý token cho Admin
// ========================================

// Base URL cho API - có thể thay đổi theo môi trường
const API_PUBLIC_URL = import.meta.env.VITE_API_PUBLIC_URL || "http://localhost:8080/api/v1/public";

// Key lưu token trong localStorage
const TOKEN_KEY = "admin_token";
const TOKEN_EXPIRY_KEY = "admin_token_expiry";

/**
 * Đăng nhập Admin
 * @param {string} email - Email đăng nhập
 * @param {string} password - Mật khẩu
 * @returns {Promise<{token: string, expiresIn: number}>} Token và thời gian hết hạn
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_PUBLIC_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Invalid credentials");
    }

    const data = await response.json();

    // Debug: Log response để kiểm tra cấu trúc dữ liệu từ API
    console.log("[DEBUG] AuthService - API Response:", data);

    // Hỗ trợ nhiều format response từ Backend
    // API trả về: { data: { access_token: "...", expires_in: 86400 } }
    const token =
      data.data?.access_token ||
      data.data?.token ||
      data.data?.accessToken ||
      data.token ||
      data.accessToken ||
      data.access_token ||
      data.jwt;

    // Thời gian hết hạn (tính bằng giây) - API trả về expires_in: 86400
    const expiresIn =
      data.data?.expires_in || data.data?.expiresIn || data.expiresIn || data.expires_in || 3600;

    // Lưu token vào localStorage
    if (token) {
      console.log("[INFO] AuthService - Token received, saving to localStorage...");
      setToken(token, expiresIn);
      console.log("[SUCCESS] AuthService - Token saved successfully!");
    } else {
      console.error("[ERROR] AuthService - No token found in response:", data);
      throw new Error("Token not found in server response");
    }

    return { token, expiresIn };
  } catch (error) {
    console.error("[ERROR] AuthService - Login failed:", error);
    throw error;
  }
};

/**
 * Đăng xuất - Xóa token khỏi localStorage
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Lưu token vào localStorage với thời gian hết hạn
 * @param {string} token - JWT token
 * @param {number} expiresIn - Thời gian hết hạn (giây)
 */
export const setToken = (token, expiresIn = 3600) => {
  localStorage.setItem(TOKEN_KEY, token);
  // Tính thời điểm hết hạn
  const expiryTime = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

/**
 * Lấy token từ localStorage
 * @returns {string|null} Token hoặc null nếu không có/hết hạn
 */
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !expiry) {
    return null;
  }

  // Kiểm tra token còn hạn không
  if (Date.now() > parseInt(expiry, 10)) {
    // Token đã hết hạn, xóa đi
    logout();
    return null;
  }

  return token;
};

/**
 * Kiểm tra người dùng đã đăng nhập chưa
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return getToken() !== null;
};

/**
 * Tạo header với Authorization token
 * @returns {Object} Headers object với Bearer token
 */
export const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};
