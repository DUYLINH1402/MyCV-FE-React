// ========================================
// SERVICE: Skills API Service
// Gọi API lấy danh sách skills từ Backend
// ========================================

// Base URL cho API Backend - có thể thay đổi theo môi trường
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

/**
 * Lấy danh sách skills từ API
 * @returns {Promise<Array>} Danh sách skills
 * Response format: { status, message, data: [{ id, name, category, level, createdAt, updatedAt }] }
 */
export const getSkills = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // API trả về format: { status, message, data, timestamp }
    if (result.status === 200 && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to fetch skills");
  } catch (error) {
    console.error("[ERROR] Failed to fetch skills:", error);
    throw error;
  }
};

/**
 * Nhóm skills theo category
 * @param {Array} skills - Danh sách skills từ API
 * @returns {Object} Skills được nhóm theo category
 */
export const groupSkillsByCategory = (skills) => {
  return skills.reduce((acc, skill) => {
    const category = skill.category || "OTHER";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});
};

export default {
  getSkills,
  groupSkillsByCategory,
};
