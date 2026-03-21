// ========================================
// PAGE: Experiences Management
// Quản lý kinh nghiệm làm việc với giao diện CRUD
// Thiết kế: Danh sách timeline + Modal thêm/sửa
// ========================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  formatDateRange,
  calculateDuration,
  isCurrentlyWorking,
} from "../../../services/experienceService";

/**
 * ExperiencesManagement Component
 * CRUD kinh nghiệm làm việc cho Admin Dashboard
 */
const ExperiencesManagement = () => {
  const { getToken } = useAuth();

  // State
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    companyLogo: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: [],
  });

  // Input tạm cho description bullet point
  const [descInput, setDescInput] = useState("");

  // Fetch data khi mount
  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      console.error("[ERROR] Failed to fetch experiences:", error);
      showNotification("error", "Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  // Lọc theo search
  const filteredExperiences = experiences.filter((exp) => {
    const query = searchQuery.toLowerCase();
    return (
      exp.jobTitle.toLowerCase().includes(query) ||
      exp.company.toLowerCase().includes(query) ||
      (exp.location && exp.location.toLowerCase().includes(query))
    );
  });

  // Mở modal thêm mới
  const handleAddNew = () => {
    setEditingExp(null);
    setFormData({
      jobTitle: "",
      company: "",
      companyLogo: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: [],
    });
    setDescInput("");
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleEdit = (exp) => {
    setEditingExp(exp);
    setFormData({
      jobTitle: exp.jobTitle,
      company: exp.company,
      companyLogo: exp.companyLogo || "",
      location: exp.location || "",
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      currentlyWorking: exp.endDate === null,
      description: [...exp.description],
    });
    setDescInput("");
    setIsModalOpen(true);
  };

  // Xóa experience
  const handleDelete = async (expId) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;

    try {
      const token = getToken();
      await deleteExperience(expId, token);
      setExperiences((prev) => prev.filter((e) => e.id !== expId));
      showNotification("success", "Experience deleted successfully!");
    } catch (error) {
      showNotification("error", "Failed to delete experience");
    }
  };

  // Lưu experience (thêm mới hoặc cập nhật)
  const handleSave = async () => {
    // Validation
    if (!formData.jobTitle.trim()) {
      showNotification("error", "Job title is required");
      return;
    }
    if (!formData.company.trim()) {
      showNotification("error", "Company is required");
      return;
    }
    if (!formData.startDate) {
      showNotification("error", "Start date is required");
      return;
    }

    setIsSaving(true);

    try {
      const token = getToken();
      // Chuẩn bị payload
      const payload = {
        jobTitle: formData.jobTitle.trim(),
        company: formData.company.trim(),
        companyLogo: formData.companyLogo.trim() || null,
        location: formData.location.trim() || null,
        startDate: formData.startDate,
        endDate: formData.currentlyWorking ? null : formData.endDate || null,
        description: formData.description,
      };

      if (editingExp) {
        // Cập nhật
        const updated = await updateExperience(editingExp.id, payload, token);
        setExperiences((prev) => prev.map((e) => (e.id === editingExp.id ? updated : e)));
        showNotification("success", "Experience updated successfully!");
      } else {
        // Tạo mới
        const created = await createExperience(payload, token);
        setExperiences((prev) => [created, ...prev]);
        showNotification("success", "Experience created successfully!");
      }

      setIsModalOpen(false);
    } catch (error) {
      showNotification("error", error.message || "Failed to save experience");
    } finally {
      setIsSaving(false);
    }
  };

  // Thêm description bullet point
  const handleAddDesc = () => {
    if (descInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        description: [...prev.description, descInput.trim()],
      }));
      setDescInput("");
    }
  };

  // Xóa 1 bullet point
  const handleRemoveDesc = (index) => {
    setFormData((prev) => ({
      ...prev,
      description: prev.description.filter((_, i) => i !== index),
    }));
  };

  // Notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* === HEADER === */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dracula-foreground">Experiences Management</h1>
          <p className="text-sm text-dracula-comment mt-1">
            Manage your professional work experiences
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchExperiences}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dracula-selection hover:bg-dracula-selection/80 text-dracula-foreground transition-colors">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dracula-purple hover:bg-dracula-purple/80 text-white transition-colors">
            <Plus size={16} />
            <span>Add Experience</span>
          </button>
        </div>
      </div>

      {/* === NOTIFICATION === */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 p-4 rounded-lg ${
              notification.type === "success"
                ? "bg-dracula-green/10 border border-dracula-green/30"
                : "bg-dracula-red/10 border border-dracula-red/30"
            }`}>
            {notification.type === "success" ? (
              <CheckCircle size={20} className="text-dracula-green" />
            ) : (
              <AlertCircle size={20} className="text-dracula-red" />
            )}
            <span
              className={
                notification.type === "success" ? "text-dracula-green" : "text-dracula-red"
              }>
              {notification.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === SEARCH === */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-dracula-comment"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by job title, company, or location..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50"
        />
      </div>

      {/* === EXPERIENCE LIST === */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-dracula-orange text-lg font-mono">
            [INFO] Loading experiences...
          </div>
        </div>
      ) : filteredExperiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-dracula-comment">
          <Briefcase size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-mono">
            {searchQuery ? "No matching experiences found" : "No experiences yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExperiences.map((exp) => {
            const isCurrent = isCurrentlyWorking(exp);
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dracula-current/60 rounded-xl border border-dracula-selection p-5 hover:border-dracula-purple/40 transition-all duration-200 group">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Company Logo */}
                  {exp.companyLogo && (
                    <img
                      src={exp.companyLogo}
                      alt={`${exp.company} logo`}
                      className="w-10 h-10 rounded-lg object-contain bg-dracula-background/50 border border-dracula-selection p-1 flex-shrink-0"
                    />
                  )}

                  {/* Thông tin chính */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-dracula-foreground">{exp.jobTitle}</h3>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-dracula-green/15 text-dracula-green border border-dracula-green/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-dracula-green animate-pulse" />
                          Present
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-sm">
                      <span className="flex items-center gap-1 text-dracula-orange">
                        <Briefcase size={14} />
                        {exp.company}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1 text-dracula-comment">
                          <MapPin size={13} />
                          {exp.location}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-xs text-dracula-comment">
                      <Calendar size={12} />
                      <span>
                        {formatDateRange(exp.startDate, exp.endDate)} ·{" "}
                        {calculateDuration(exp.startDate, exp.endDate)}
                      </span>
                    </div>

                    {/* Description preview */}
                    {exp.description && exp.description.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {exp.description.slice(0, 3).map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-dracula-foreground/70">
                            <ChevronRight
                              size={12}
                              className="text-dracula-purple mt-0.5 flex-shrink-0"
                            />
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                        {exp.description.length > 3 && (
                          <li className="text-xs text-dracula-comment ml-5">
                            +{exp.description.length - 3} more...
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="p-2 rounded-lg hover:bg-dracula-purple/20 text-dracula-comment hover:text-dracula-purple transition-colors"
                      title="Edit">
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-2 rounded-lg hover:bg-dracula-red/20 text-dracula-comment hover:text-dracula-red transition-colors"
                      title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* === MODAL ADD/EDIT === */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-dracula-current rounded-xl border border-dracula-selection shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-dracula-selection">
                <h2 className="text-xl font-bold text-dracula-foreground">
                  {editingExp ? "Edit Experience" : "Add New Experience"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-dracula-selection transition-colors">
                  <X size={18} className="text-dracula-comment" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-5">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-dracula-foreground mb-1.5">
                    Job Title <span className="text-dracula-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="e.g. Backend Developer"
                    className="w-full px-4 py-2.5 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-dracula-foreground mb-1.5">
                    Company <span className="text-dracula-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. FPT Software"
                    className="w-full px-4 py-2.5 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50"
                  />
                </div>

                {/* Company Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-dracula-foreground mb-1.5">
                    Company Logo URL
                  </label>
                  <div className="flex gap-3 items-start">
                    <input
                      type="text"
                      value={formData.companyLogo}
                      onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                      placeholder="https://example.com/logos/company.png"
                      className="flex-1 px-4 py-2.5 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50"
                    />
                    {formData.companyLogo && (
                      <img
                        src={formData.companyLogo}
                        alt="Logo preview"
                        className="w-10 h-10 rounded-lg object-contain bg-dracula-background/50 border border-dracula-selection p-1 flex-shrink-0"
                      />
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-dracula-foreground mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Ho Chi Minh City, Vietnam"
                    className="w-full px-4 py-2.5 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50"
                  />
                </div>

                {/* Start Date + End Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dracula-foreground mb-1.5">
                      Start Date <span className="text-dracula-red">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground focus:outline-none focus:ring-2 focus:ring-dracula-purple/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dracula-foreground mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={formData.currentlyWorking}
                      className="w-full px-4 py-2.5 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground focus:outline-none focus:ring-2 focus:ring-dracula-purple/50 disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.currentlyWorking}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentlyWorking: e.target.checked,
                            endDate: e.target.checked ? "" : formData.endDate,
                          })
                        }
                        className="rounded border-dracula-selection text-dracula-purple focus:ring-dracula-purple/50"
                      />
                      <span className="text-sm text-dracula-comment">I currently work here</span>
                    </label>
                  </div>
                </div>

                {/* Description - Bullet points */}
                <div>
                  <label className="block text-sm font-medium text-dracula-foreground mb-1.5">
                    Job Description (bullet points)
                  </label>

                  {/* Danh sách bullets hiện tại */}
                  {formData.description.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {formData.description.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 bg-dracula-background/50 rounded-lg px-3 py-2 group/item">
                          <ChevronRight
                            size={14}
                            className="text-dracula-purple mt-0.5 flex-shrink-0"
                          />
                          <span className="flex-1 text-sm text-dracula-foreground/80">{item}</span>
                          <button
                            onClick={() => handleRemoveDesc(i)}
                            className="p-1 rounded hover:bg-dracula-red/20 text-dracula-comment hover:text-dracula-red transition-colors opacity-0 group-hover/item:opacity-100">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input thêm bullet mới */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={descInput}
                      onChange={(e) => setDescInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddDesc();
                        }
                      }}
                      placeholder="Type a bullet point and press Enter..."
                      className="flex-1 px-4 py-2.5 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50"
                    />
                    <button
                      onClick={handleAddDesc}
                      className="px-3 py-2.5 rounded-lg bg-dracula-selection hover:bg-dracula-selection/80 text-dracula-foreground transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-5 border-t border-dracula-selection">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-dracula-selection hover:bg-dracula-selection/80 text-dracula-foreground transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-dracula-purple hover:bg-dracula-purple/80 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{editingExp ? "Update" : "Save"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperiencesManagement;
