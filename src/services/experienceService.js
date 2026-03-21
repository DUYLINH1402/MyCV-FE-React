// ========================================
// SERVICE: Experience API Service
// Gọi API CRUD cho Professional Experience từ Backend
// Tương thích với ExperienceCreateRequest, ExperienceUpdateRequest
// ========================================

// Base URL cho API Backend - có thể thay đổi theo môi trường
const API_PUBLIC_URL = import.meta.env.VITE_API_PUBLIC_URL || "http://localhost:8080/api/v1/public";
const API_ADMIN_URL = import.meta.env.VITE_API_ADMIN_URL || "http://localhost:8080/api/v1/admin";

/**
 * Lấy danh sách tất cả experiences từ API (Public)
 * Đã sắp xếp theo startDate giảm dần (mới nhất trước)
 * @returns {Promise<Array>} Danh sách experiences
 */
export const getExperiences = async () => {
  try {
    const response = await fetch(`${API_PUBLIC_URL}/experiences`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // API trả về format: { status, message, data, timestamp }
    if (result.status === 200 && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to fetch experiences");
  } catch (error) {
    console.error("[ERROR] Failed to fetch experiences:", error);
    throw error;
  }
};

/**
 * Lấy experience theo ID (Public)
 * @param {number} id - Experience ID
 * @returns {Promise<Object>} Experience data
 */
export const getExperienceById = async (id) => {
  try {
    const response = await fetch(`${API_PUBLIC_URL}/experiences/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.status === 200 && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to fetch experience");
  } catch (error) {
    console.error("[ERROR] Failed to fetch experience:", error);
    throw error;
  }
};

/**
 * Tạo mới experience (Admin - yêu cầu token)
 * @param {Object} data - { jobTitle, company, location?, startDate, endDate?, description? }
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Experience đã tạo
 */
export const createExperience = async (data, token) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/experiences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.status === 201 && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to create experience");
  } catch (error) {
    console.error("[ERROR] Failed to create experience:", error);
    throw error;
  }
};

/**
 * Cập nhật experience (Admin - yêu cầu token, partial update)
 * @param {number} id - Experience ID
 * @param {Object} data - Các field muốn cập nhật
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Experience đã cập nhật
 */
export const updateExperience = async (id, data, token) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/experiences/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.status === 200 && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to update experience");
  } catch (error) {
    console.error("[ERROR] Failed to update experience:", error);
    throw error;
  }
};

/**
 * Xóa experience (Admin - yêu cầu token, soft delete)
 * @param {number} id - Experience ID
 * @param {string} token - JWT token
 * @returns {Promise<void>}
 */
export const deleteExperience = async (id, token) => {
  try {
    const response = await fetch(`${API_ADMIN_URL}/experiences/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("[ERROR] Failed to delete experience:", error);
    throw error;
  }
};

/**
 * Utility: Kiểm tra có đang làm việc tại đây không
 * @param {Object} experience - Experience object
 * @returns {boolean}
 */
export const isCurrentlyWorking = (experience) => {
  return experience.endDate === null;
};

/**
 * Utility: Tính thời gian làm việc
 * @param {string} startDate - Format "YYYY-MM-DD"
 * @param {string|null} endDate - Format "YYYY-MM-DD" hoặc null
 * @returns {string} Ví dụ: "1 year 2 months"
 */
export const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
  }
  if (remainingMonths === 0) {
    return `${years} year${years > 1 ? "s" : ""}`;
  }
  return `${years} year${years > 1 ? "s" : ""} ${remainingMonths} month${
    remainingMonths > 1 ? "s" : ""
  }`;
};

/**
 * Utility: Format date range hiển thị
 * @param {string} startDate - Format "YYYY-MM-DD"
 * @param {string|null} endDate - Format "YYYY-MM-DD" hoặc null
 * @returns {string} Ví dụ: "Jan 2024 - Present"
 */
export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const startFormatted = start.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  if (endDate === null) {
    return `${startFormatted} - Present`;
  }

  const end = new Date(endDate);
  const endFormatted = end.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return `${startFormatted} - ${endFormatted}`;
};

export default {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  isCurrentlyWorking,
  calculateDuration,
  formatDateRange,
};
