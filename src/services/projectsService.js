// ========================================
// SERVICE: Projects API Service
// Gọi API CRUD cho Projects từ Backend
// Tương thích với ProjectCreateDTO, ProjectUpdateDTO, ProjectResponseDTO
// ========================================

// Base URL cho API Backend - có thể thay đổi theo môi trường
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

/**
 * Lấy danh sách tất cả projects từ API (Public)
 * @returns {Promise<Array>} Danh sách projects theo ProjectResponseDTO
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
 * Lấy project theo ID (Public)
 * @param {number} id - ID của project
 * @returns {Promise<Object>} Project data theo ProjectResponseDTO
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

/**
 * Tạo mới project (Admin - yêu cầu token)
 * @param {Object} projectData - Dữ liệu theo ProjectCreateDTO
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Project đã tạo theo ProjectResponseDTO
 */
export const createProject = async (projectData, token) => {
  try {
    console.log("[INFO] Creating project:", projectData);
    const response = await fetch(`${API_BASE_URL}/admin/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === 201 && result.data) {
      console.log("[SUCCESS] Project created:", result.data);
      return result.data;
    }

    throw new Error(result.message || "Failed to create project");
  } catch (error) {
    console.error("[ERROR] Failed to create project:", error);
    throw error;
  }
};

/**
 * Cập nhật project (Admin - yêu cầu token)
 * @param {number} id - ID của project
 * @param {Object} projectData - Dữ liệu theo ProjectUpdateDTO (chỉ gửi field cần update)
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Project đã cập nhật theo ProjectResponseDTO
 */
export const updateProject = async (id, projectData, token) => {
  try {
    console.log("[INFO] Updating project:", id, projectData);
    const response = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === 200 && result.data) {
      console.log("[SUCCESS] Project updated:", result.data);
      return result.data;
    }

    throw new Error(result.message || "Failed to update project");
  } catch (error) {
    console.error("[ERROR] Failed to update project:", error);
    throw error;
  }
};

/**
 * Xóa project (Admin - yêu cầu token)
 * @param {number} id - ID của project
 * @param {string} token - JWT token
 * @returns {Promise<void>}
 */
export const deleteProject = async (id, token) => {
  try {
    console.log("[INFO] Deleting project:", id);
    const response = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
    }

    console.log("[SUCCESS] Project deleted:", id);
  } catch (error) {
    console.error("[ERROR] Failed to delete project:", error);
    throw error;
  }
};

export default {
  getProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
