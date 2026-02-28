// ========================================
// INDEX: Export tất cả services
// ========================================

export { getProfile } from "./profileService";
export { getSkills, groupSkillsByCategory } from "./skillsService";
export { getProjects, getFeaturedProjects, getProjectById } from "./projectsService";
export { login, logout, getToken, isAuthenticated, getAuthHeaders } from "./authService";
