// ========================================
// SERVICE: Profile API Service
// Gọi API lấy thông tin profile từ Backend
// ========================================

// Base URL cho API Backend - có thể thay đổi theo môi trường
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

/**
 * Lấy thông tin profile từ API
 * @returns {Promise<Object>} Dữ liệu profile
 */
export const getProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`);
    console.log("Fetching profile from:", `${API_BASE_URL}/profile`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // API trả về format: { status, message, data, timestamp }
    if (result.status === 200 && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to fetch profile");
  } catch (error) {
    console.error("[ERROR] Failed to fetch profile:", error);
    throw error;
  }
};

export default {
  getProfile,
};
