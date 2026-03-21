// ========================================
// INDEX: Export tất cả services
// ========================================

export { getProfile } from "./profileService";
export { getSkills, groupSkillsByCategory } from "./skillsService";
export {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  formatDateRange,
  calculateDuration,
  isCurrentlyWorking,
} from "./experienceService";
export { getProjects, getFeaturedProjects, getProjectById } from "./projectsService";
export { login, logout, getToken, isAuthenticated, getAuthHeaders } from "./authService";
export { submitContact } from "./contactService";
