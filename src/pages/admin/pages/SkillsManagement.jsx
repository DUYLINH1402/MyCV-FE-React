// ========================================
// PAGE: Skills Management
// Quản lý kỹ năng với giao diện CRUD đầy đủ
// Thiết kế: Danh sách skills + Modal edit
// ========================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Star,
  Layers,
  Terminal,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
// Import react-icons cho các icon fallback (không có trong assets)
import {
  FaAws,
  FaCode,
  FaDatabase,
  FaServer,
  FaCogs,
  FaTools,
  FaCubes,
  FaPencilRuler,
} from "react-icons/fa";
import { SiApachemaven } from "react-icons/si";

// Import các icon custom từ assets/icons
import { Java } from "../../../assets/icons/Java";
import { Spring } from "../../../assets/icons/Spring";
import { PostgreSQL } from "../../../assets/icons/PostgreSQL";
import { MySQL } from "../../../assets/icons/MySQL";
import { Redis } from "../../../assets/icons/Redis";
import { Docker } from "../../../assets/icons/Docker";
import { React as ReactIcon } from "../../../assets/icons/React";
import { JavaScript } from "../../../assets/icons/JavaScript";
import { TailwindCSS } from "../../../assets/icons/TailwindCSS";
import { Swagger } from "../../../assets/icons/Swagger";
import { GitHub } from "../../../assets/icons/GitHub";
import { HTML5 } from "../../../assets/icons/HTML5";
import { CSS } from "../../../assets/icons/CSS";
import { SocketIO } from "../../../assets/icons/SocketIO";
import { Firebase } from "../../../assets/icons/Firebase";
import { Vite } from "../../../assets/icons/Vite";
import { Redux } from "../../../assets/icons/Redux";
import { Sass } from "../../../assets/icons/Sass";
import { AntDesign } from "../../../assets/icons/AntDesign";

import { useAuth } from "../../../context/AuthContext";
import { getSkills } from "../../../services/skillsService";

/**
 * SkillsManagement Component
 * Quản lý skills với các thao tác CRUD
 * API Response format: { id, name, category, level, priority, createdAt, updatedAt }
 */
const SkillsManagement = () => {
  const { getToken } = useAuth();

  // State
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form state cho modal - theo đúng API response
  const [formData, setFormData] = useState({
    name: "",
    category: "BACKEND",
    level: "LOW",
    priority: 1,
  });

  // Fetch skills từ API
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await getSkills();
      console.log("[SkillsManagement] Fetched skills:", data);
      // Sắp xếp theo priority
      const sortedSkills = data.sort((a, b) => a.priority - b.priority);
      setSkills(sortedSkills);
    } catch (error) {
      console.error("[ERROR] Failed to fetch skills:", error);
      showNotification("error", "Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  // Categories theo API - FRONTEND, BACKEND, DATABASE, TOOLS, DEVOPS, OTHER
  const categories = [
    { id: "ALL", label: "All Skills", color: "gray" },
    { id: "BACKEND", label: "Backend", color: "green" },
    { id: "FRONTEND", label: "Frontend", color: "cyan" },
    { id: "DATABASE", label: "Database", color: "orange" },
    { id: "DEVOPS", label: "DevOps", color: "purple" },
    { id: "TOOLS", label: "Tools", color: "pink" },
    { id: "OTHER", label: "Other", color: "gray" },
  ];

  // Level options theo API
  const levelOptions = [
    { value: "LOW", label: "Beginner", color: "orange", percent: 33 },
    { value: "MEDIUM", label: "Intermediate", color: "yellow", percent: 66 },
    { value: "HIGH", label: "Advanced", color: "green", percent: 100 },
  ];

  // Color mapping cho categories
  const categoryColors = {
    BACKEND: "bg-dracula-green/20 text-dracula-green border-dracula-green/30",
    FRONTEND: "bg-dracula-cyan/20 text-dracula-cyan border-dracula-cyan/30",
    DATABASE: "bg-dracula-orange/20 text-dracula-orange border-dracula-orange/30",
    DEVOPS: "bg-dracula-purple/20 text-dracula-purple border-dracula-purple/30",
    TOOLS: "bg-dracula-pink/20 text-dracula-pink border-dracula-pink/30",
    OTHER: "bg-dracula-comment/20 text-dracula-comment border-dracula-comment/30",
  };

  // Lấy phần trăm từ level
  const getLevelPercent = (level) => {
    const found = levelOptions.find((l) => l.value === level);
    return found ? found.percent : 50;
  };

  // Lấy label từ level
  const getLevelLabel = (level) => {
    const found = levelOptions.find((l) => l.value === level);
    return found ? found.label : level;
  };

  // Lọc skills theo search và category
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Xử lý mở modal thêm mới
  const handleAddNew = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category: "BACKEND",
      level: "LOW",
      priority: skills.length + 1,
    });
    setIsModalOpen(true);
  };

  // Xử lý mở modal chỉnh sửa
  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      priority: skill.priority,
    });
    setIsModalOpen(true);
  };

  // Xử lý xóa skill
  const handleDelete = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      // TODO: Gọi API xóa - DELETE /api/v1/skills/{id}
      // const token = getToken();
      // await deleteSkill(skillId, token);
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      showNotification("success", "Skill deleted successfully!");
    } catch (error) {
      showNotification("error", "Failed to delete skill");
    }
  };

  // Xử lý lưu skill (thêm mới hoặc cập nhật)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      showNotification("error", "Skill name is required");
      return;
    }

    setIsSaving(true);

    try {
      if (editingSkill) {
        // Update existing skill
        setSkills((prev) =>
          prev.map((s) => (s.id === editingSkill.id ? { ...s, ...formData } : s))
        );
        showNotification("success", "Skill updated successfully!");
      } else {
        // Add new skill
        const newSkill = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setSkills((prev) => [...prev, newSkill]);
        showNotification("success", "Skill added successfully!");
      }

      setIsModalOpen(false);
      // Refresh data từ API
      // await fetchSkills();
    } catch (error) {
      showNotification("error", "Failed to save skill");
    } finally {
      setIsSaving(false);
    }
  };

  // Hiển thị notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Level color based on API level values
  const getLevelColor = (level) => {
    switch (level) {
      case "HIGH":
        return "bg-dracula-green";
      case "MEDIUM":
        return "bg-dracula-yellow";
      case "LOW":
      default:
        return "bg-dracula-orange";
    }
  };

  // Icon mapping cho skills - Map theo đúng tên từ API
  // Ưu tiên icon custom từ assets/icons, fallback sang react-icons library
  const getSkillIcon = (name, category) => {
    const size = 24;
    const iconClass = "w-10 h-10";

    // Map tên skill từ API với icon từ assets/icons
    const iconMap = {
      // === BACKEND ===
      Java: <Java className={iconClass} />,
      "Spring Boot": <Spring className={iconClass} />,
      "Spring Security": <Spring className={iconClass} />,
      "Spring DATABASE JPA": <Spring className={iconClass} />,
      "RESTful API": <FaServer size={size} className="text-dracula-cyan" />,
      "OOP & SOLID Principles": <FaCubes size={size} className="text-dracula-green" />,
      "Design Patterns": <FaPencilRuler size={size} className="text-dracula-purple" />,

      // === DATABASE ===
      MySQL: <MySQL className={iconClass} />,
      PostgreSQL: <PostgreSQL className={iconClass} />,
      Redis: <Redis className={iconClass} />,

      // === DEVOPS ===
      Docker: <Docker className={iconClass} />,
      "AWS (Basic)": <FaAws size={size} className="text-[#FF9900]" />,
      Swagger: <Swagger className={iconClass} />,

      // === TOOLS ===
      "Git/GitHub": <GitHub className={iconClass} />,
      Maven: <SiApachemaven size={size} className="text-[#C71A36]" />,

      // === FRONTEND ===
      JavaScript: <JavaScript className={iconClass} />,
      HTML5: <HTML5 className={iconClass} />,
      CSS: <CSS className={iconClass} />,
      ReactJS: <ReactIcon className={iconClass} />,
      Vite: <Vite className={iconClass} />,
      "Redux Toolkit": <Redux className={iconClass} />,
      "Tailwind CSS": <TailwindCSS className={iconClass} />,
      "Sass CSS": <Sass className={iconClass} />,
      "Ant Design": <AntDesign className={iconClass} />,
      Firebase: <Firebase className={iconClass} />,
      "SocketIO (STOMP Client)": <SocketIO className={iconClass} />,
    };

    // Trả về icon nếu tìm thấy
    if (iconMap[name]) {
      return iconMap[name];
    }

    // Icon mặc định theo category
    const defaultIcons = {
      BACKEND: <FaServer size={size} className="text-dracula-green" />,
      FRONTEND: <ReactIcon className={iconClass} />,
      DATABASE: <FaDatabase size={size} className="text-dracula-orange" />,
      DEVOPS: <FaCogs size={size} className="text-dracula-purple" />,
      TOOLS: <FaTools size={size} className="text-dracula-pink" />,
      OTHER: <FaCode size={size} className="text-dracula-comment" />,
    };

    return defaultIcons[category] || <FaCode size={size} className="text-dracula-comment" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* === HEADER === */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dracula-foreground">Skills Management</h1>
          <p className="text-sm text-dracula-comment mt-1">
            Manage your technical skills and expertise levels
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dracula-purple hover:bg-dracula-purple/80 text-white transition-colors self-start sm:self-auto">
          <Plus size={16} />
          <span>Add Skill</span>
        </button>
      </div>

      {/* === NOTIFICATION === */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              flex items-center gap-3 p-4 rounded-lg
              ${
                notification.type === "success"
                  ? "bg-dracula-green/10 border border-dracula-green/30"
                  : "bg-dracula-red/10 border border-dracula-red/30"
              }
            `}>
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

      {/* === FILTERS === */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dracula-comment"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                px-3 py-2 rounded-lg text-sm transition-all
                ${
                  selectedCategory === cat.id
                    ? "bg-dracula-purple text-white"
                    : "bg-dracula-selection text-dracula-comment hover:text-dracula-foreground"
                }
              `}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* === SKILLS GRID === */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={24} className="animate-spin text-dracula-comment" />
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center py-12 text-dracula-comment">
          <Code2 size={48} className="mx-auto mb-4 opacity-50" />
          <p>No skills found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-xl border border-dracula-selection bg-dracula-background/50 hover:border-dracula-purple/50 transition-all group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-dracula-selection/50 flex items-center justify-center">
                    {getSkillIcon(skill.name, skill.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-dracula-foreground">{skill.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        categoryColors[skill.category] || categoryColors.OTHER
                      }`}>
                      {skill.category}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="p-2 rounded-lg hover:bg-dracula-selection text-dracula-comment hover:text-dracula-cyan transition-colors">
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="p-2 rounded-lg hover:bg-dracula-red/10 text-dracula-comment hover:text-dracula-red transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Priority badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-dracula-comment">Priority:</span>
                <span className="text-xs px-2 py-0.5 rounded bg-dracula-selection text-dracula-foreground">
                  #{skill.priority}
                </span>
              </div>

              {/* Level bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dracula-comment">Level</span>
                  <span className="text-dracula-foreground font-medium">
                    {getLevelLabel(skill.level)}
                  </span>
                </div>
                <div className="h-2 bg-dracula-selection rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getLevelPercent(skill.level)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`h-full rounded-full ${getLevelColor(skill.level)}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* === MODAL ADD/EDIT === */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-dracula-current rounded-xl border border-dracula-selection shadow-2xl overflow-hidden">
              {/* Modal header */}
              <div className="px-6 py-4 border-b border-dracula-selection flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-dracula-purple/20 flex items-center justify-center">
                    <Code2 size={20} className="text-dracula-purple" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-dracula-foreground">
                      {editingSkill ? "Edit Skill" : "Add New Skill"}
                    </h2>
                    <p className="text-xs text-dracula-comment">
                      {editingSkill ? "Update skill details" : "Add a new skill to your portfolio"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-dracula-selection text-dracula-comment hover:text-dracula-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Modal content */}
              <div className="p-6 space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm text-dracula-comment">Skill Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Spring Boot"
                    className="w-full px-4 py-3 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50"
                  />
                </div>

                {/* Category - theo API categories */}
                <div className="space-y-2">
                  <label className="text-sm text-dracula-comment">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground focus:outline-none focus:ring-2 focus:ring-dracula-purple/50">
                    <option value="BACKEND">Backend</option>
                    <option value="FRONTEND">Frontend</option>
                    <option value="DATABASE">Database</option>
                    <option value="DEVOPS">DevOps</option>
                    <option value="TOOLS">Tools</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Level - theo API levels: LOW, MEDIUM, HIGH */}
                <div className="space-y-2">
                  <label className="text-sm text-dracula-comment">Skill Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {levelOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, level: option.value }))}
                        className={`
                          px-4 py-3 rounded-lg border text-sm font-medium transition-all
                          ${
                            formData.level === option.value
                              ? option.value === "HIGH"
                                ? "bg-dracula-green/20 border-dracula-green text-dracula-green"
                                : option.value === "MEDIUM"
                                ? "bg-dracula-yellow/20 border-dracula-yellow text-dracula-yellow"
                                : "bg-dracula-orange/20 border-dracula-orange text-dracula-orange"
                              : "border-dracula-selection text-dracula-comment hover:border-dracula-purple/50"
                          }
                        `}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-dracula-comment">Priority (Display Order)</label>
                    <span className="text-sm font-medium text-dracula-foreground">
                      #{formData.priority}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, priority: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full px-4 py-3 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50"
                  />
                  <p className="text-xs text-dracula-comment">
                    Lower number = higher priority (displayed first)
                  </p>
                </div>
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4 border-t border-dracula-selection flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-dracula-selection text-dracula-comment hover:text-dracula-foreground hover:bg-dracula-selection transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dracula-green hover:bg-dracula-green/80 text-dracula-background transition-colors disabled:opacity-50">
                  {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{isSaving ? "Saving..." : "Save Skill"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsManagement;
