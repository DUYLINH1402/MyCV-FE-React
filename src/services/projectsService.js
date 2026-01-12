// ========================================
// SERVICE: Projects API Service
// Gọi API lấy danh sách projects từ Backend
// ========================================

// Base URL cho API Backend - có thể thay đổi theo môi trường
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

/**
 * Lấy danh sách tất cả projects từ API
 * @returns {Promise<Array>} Danh sách projects
 */
export const getProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    console.log("[INFO] Fetching projects from:", `${API_BASE_URL}/projects`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // API trả về format: { status, message, data, timestamp }
    if (result.status === 200 && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to fetch projects");
  } catch (error) {
    console.error("[ERROR] Failed to fetch projects:", error);
    throw error;
  }
};

/**
 * Lấy danh sách featured projects (isFeatured = true)
 * @returns {Promise<Array>} Danh sách featured projects
 */
export const getFeaturedProjects = async () => {
  try {
    const projects = await getProjects();
    return projects
      .filter((project) => project.isFeatured)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  } catch (error) {
    console.error("[ERROR] Failed to fetch featured projects:", error);
    throw error;
  }
};

/**
 * Lấy project theo ID
 * @param {number} id - ID của project
 * @returns {Promise<Object>} Project data
 */
export const getProjectById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    console.log("[INFO] Fetching project:", `${API_BASE_URL}/projects/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === 200 && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to fetch project");
  } catch (error) {
    console.error("[ERROR] Failed to fetch project:", error);
    throw error;
  }
};

export default {
  getProjects,
  getFeaturedProjects,
  getProjectById,
};
