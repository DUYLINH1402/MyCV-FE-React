// ========================================
// PAGE: Projects Management
// Quản lý dự án với giao diện CRUD đầy đủ
// Thiết kế: Danh sách projects dạng card + Modal edit
// ========================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderGit2,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  RefreshCw,
  Search,
  ExternalLink,
  Github,
  CheckCircle,
  AlertCircle,
  Calendar,
  Tag,
  Image,
  Link,
  FileText,
  Star,
  Video,
  BookOpen,
  Layers,
  ArrowUpDown,
  ImagePlus,
  Grip,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../../services/projectsService";

/**
 * ProjectsManagement Component
 * Quản lý projects với các thao tác CRUD
 * API Response format theo ProjectResponseDTO
 */
const ProjectsManagement = () => {
  const { getToken } = useAuth();

  // State chính
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // State cho các tab trong modal
  const [activeTab, setActiveTab] = useState("basic");

  // Form state cho modal - theo đúng DTO từ Backend
  const initialFormData = {
    title: "",
    shortDescription: "",
    fullDescription: null, // JSON object
    imageUrl: "",
    demoUrl: "",
    githubUrl: "",
    reviewUrl: "",
    videoUrl: "",
    gallery: [], // List<String>
    technologies: [], // List<String>
    category: "Backend",
    isFeatured: false,
    displayOrder: 1,
    status: "in_progress",
    projectDate: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // Input tạm cho technologies và gallery
  const [techInput, setTechInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");

  // Các categories theo Backend
  const categories = [
    { id: "ALL", label: "All Projects", color: "gray" },
    { id: "Backend", label: "Backend", color: "green" },
    { id: "Web", label: "Web", color: "cyan" },
    { id: "Mobile", label: "Mobile", color: "purple" },
    { id: "Fullstack", label: "Fullstack", color: "orange" },
  ];

  // Status options theo Backend
  const statusOptions = [
    { value: "completed", label: "Completed", color: "green" },
    { value: "in_progress", label: "In Progress", color: "yellow" },
    { value: "archived", label: "Archived", color: "gray" },
  ];

  // Tabs trong modal
  const modalTabs = [
    { id: "basic", label: "Basic Info", icon: FileText },
    { id: "urls", label: "URLs & Links", icon: Link },
    { id: "media", label: "Media & Gallery", icon: Image },
    { id: "advanced", label: "Advanced", icon: Layers },
  ];

  // Fetch projects từ API
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      console.log("[ProjectsManagement] Fetched projects:", data);
      // Sắp xếp theo displayOrder
      const sortedProjects = data.sort((a, b) => a.displayOrder - b.displayOrder);
      setProjects(sortedProjects);
    } catch (error) {
      console.error("[ERROR] Failed to fetch projects:", error);
      showNotification("error", "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // Lọc projects theo search và category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "ALL" || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Xử lý mở modal thêm mới
  const handleAddNew = () => {
    setEditingProject(null);
    setFormData(initialFormData);
    setTechInput("");
    setGalleryInput("");
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  // Xử lý mở modal chỉnh sửa
  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      shortDescription: project.shortDescription || "",
      fullDescription: project.fullDescription || null,
      imageUrl: project.imageUrl || "",
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
      reviewUrl: project.reviewUrl || "",
      videoUrl: project.videoUrl || "",
      gallery: project.gallery || [],
      technologies: project.technologies || [],
      category: project.category || "Backend",
      isFeatured: project.isFeatured || false,
      displayOrder: project.displayOrder || 1,
      status: project.status || "in_progress",
      projectDate: project.projectDate || "",
    });
    setTechInput("");
    setGalleryInput("");
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  // Xử lý xóa project
  const handleDelete = async (projectId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa project này?")) return;

    try {
      const token = await getToken();
      await deleteProject(projectId, token);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      showNotification("success", "Project deleted successfully!");
    } catch (error) {
      showNotification("error", error.message || "Failed to delete project");
    }
  };

  // Xử lý thêm technology
  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  // Xử lý xóa technology
  const handleRemoveTech = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  // Xử lý thêm gallery image
  const handleAddGallery = () => {
    if (galleryInput.trim() && !formData.gallery.includes(galleryInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, galleryInput.trim()],
      }));
      setGalleryInput("");
    }
  };

  // Xử lý xóa gallery image
  const handleRemoveGallery = (url) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g !== url),
    }));
  };

  // Xử lý lưu project
  const handleSave = async () => {
    if (!formData.title.trim()) {
      showNotification("error", "Project title is required");
      return;
    }

    setIsSaving(true);

    try {
      const token = await getToken();

      // Chuẩn bị dữ liệu gửi API
      const projectData = {
        title: formData.title,
        shortDescription: formData.shortDescription || null,
        fullDescription: formData.fullDescription || null,
        imageUrl: formData.imageUrl || null,
        demoUrl: formData.demoUrl || null,
        githubUrl: formData.githubUrl || null,
        reviewUrl: formData.reviewUrl || null,
        videoUrl: formData.videoUrl || null,
        gallery: formData.gallery.length > 0 ? formData.gallery : null,
        technologies: formData.technologies.length > 0 ? formData.technologies : null,
        category: formData.category,
        isFeatured: formData.isFeatured,
        displayOrder: formData.displayOrder,
        status: formData.status,
        projectDate: formData.projectDate || null,
      };

      if (editingProject) {
        // Update project
        const updatedProject = await updateProject(editingProject.id, projectData, token);
        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? updatedProject : p)));
        showNotification("success", "Project updated successfully!");
      } else {
        // Create project
        const newProject = await createProject(projectData, token);
        setProjects((prev) => [...prev, newProject]);
        showNotification("success", "Project created successfully!");
      }

      setIsModalOpen(false);
    } catch (error) {
      showNotification("error", error.message || "Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  // Hiển thị notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Status colors
  const getStatusStyle = (status) => {
    const styles = {
      completed: "bg-dracula-green/20 text-dracula-green border-dracula-green/30",
      in_progress: "bg-dracula-yellow/20 text-dracula-yellow border-dracula-yellow/30",
      archived: "bg-dracula-comment/20 text-dracula-comment border-dracula-comment/30",
    };
    return styles[status] || styles.in_progress;
  };

  // Category colors
  const getCategoryStyle = (category) => {
    const styles = {
      Backend: "bg-dracula-green/20 text-dracula-green border-dracula-green/30",
      Web: "bg-dracula-cyan/20 text-dracula-cyan border-dracula-cyan/30",
      Mobile: "bg-dracula-purple/20 text-dracula-purple border-dracula-purple/30",
      Fullstack: "bg-dracula-orange/20 text-dracula-orange border-dracula-orange/30",
    };
    return styles[category] || styles.Backend;
  };

  // Render tabs content trong modal
  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                <FileText size={14} />
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., E-Commerce Platform"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                <FileText size={14} />
                Short Description
                <span className="text-xs text-gray-400 dark:text-dracula-comment/50">
                  (max 500 chars)
                </span>
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))
                }
                placeholder="Brief one-line description for listing..."
                rows={2}
                maxLength={500}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50 resize-none"
              />
              <div className="text-right text-xs text-gray-400 dark:text-dracula-comment/50">
                {formData.shortDescription.length}/500
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                <Tag size={14} />
                Technologies
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
                  placeholder="Add technology (e.g., Java, Spring Boot)..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50"
                />
                <button
                  onClick={handleAddTech}
                  className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-dracula-selection hover:bg-orange-500/20 dark:hover:bg-dracula-purple/20 text-gray-900 dark:text-dracula-foreground transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-100 dark:bg-dracula-cyan/20 text-cyan-700 dark:text-dracula-cyan text-sm">
                      {tech}
                      <button
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-red-500 dark:hover:text-dracula-red transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                  <Layers size={14} />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50">
                  <option value="Backend">Backend</option>
                  <option value="Web">Web</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Fullstack">Fullstack</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600 dark:text-dracula-comment">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50">
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "urls":
        return (
          <div className="space-y-5">
            {/* GitHub URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                <Github size={14} />
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/username/repo"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50"
              />
            </div>

            {/* Demo URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                <ExternalLink size={14} />
                Demo URL
              </label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, demoUrl: e.target.value }))}
                placeholder="https://demo.example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50"
              />
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                <Video size={14} />
                Video URL (YouTube, Vimeo...)
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50"
              />
            </div>

            {/* Review URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                <BookOpen size={14} />
                Review/Blog URL
              </label>
              <input
                type="url"
                value={formData.reviewUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, reviewUrl: e.target.value }))}
                placeholder="https://blog.example.com/project-review"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50"
              />
            </div>
          </div>
        );

      case "media":
        return (
          <div className="space-y-5">
            {/* Thumbnail URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                <Image size={14} />
                Thumbnail URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50"
              />
              {/* Preview thumbnail */}
              {formData.imageUrl && (
                <div className="mt-2 p-2 rounded-lg bg-gray-100 dark:bg-dracula-selection">
                  <img
                    src={formData.imageUrl}
                    alt="Thumbnail preview"
                    className="h-32 w-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Gallery */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                <ImagePlus size={14} />
                Gallery Images
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddGallery())}
                  placeholder="Add image URL..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50"
                />
                <button
                  onClick={handleAddGallery}
                  className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-dracula-selection hover:bg-orange-500/20 dark:hover:bg-dracula-purple/20 text-gray-900 dark:text-dracula-foreground transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              {formData.gallery.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {formData.gallery.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="h-20 w-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150?text=Error";
                        }}
                      />
                      <button
                        onClick={() => handleRemoveGallery(url)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "advanced":
        return (
          <div className="space-y-5">
            {/* Featured toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-dracula-selection">
              <div className="flex items-center gap-3">
                <Star size={18} className="text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-dracula-foreground">
                    Featured Project
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dracula-comment">
                    Display this project prominently
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFormData((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
                className={`
                  w-12 h-6 rounded-full transition-colors relative
                  ${formData.isFeatured ? "bg-yellow-500" : "bg-gray-300 dark:bg-dracula-comment"}
                `}>
                <span
                  className={`
                    absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                    ${formData.isFeatured ? "left-7" : "left-1"}
                  `}
                />
              </button>
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                <ArrowUpDown size={14} />
                Display Order
                <span className="text-xs text-gray-400 dark:text-dracula-comment/50">
                  (lower = higher priority)
                </span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    displayOrder: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50"
              />
            </div>

            {/* Project Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                <Calendar size={14} />
                Project Date
              </label>
              <input
                type="date"
                value={formData.projectDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, projectDate: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50"
              />
            </div>

            {/* Full Description JSON Editor */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-dracula-comment">
                <FileText size={14} />
                Full Description (JSON)
                <span className="text-xs text-gray-400 dark:text-dracula-comment/50">
                  (Advanced - for detailed content)
                </span>
              </label>
              <textarea
                value={
                  formData.fullDescription ? JSON.stringify(formData.fullDescription, null, 2) : ""
                }
                onChange={(e) => {
                  try {
                    const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                    setFormData((prev) => ({ ...prev, fullDescription: parsed }));
                  } catch {
                    // Giữ nguyên giá trị cũ nếu JSON không hợp lệ
                  }
                }}
                placeholder='{"overview": "...", "features": [...], "highlights": [...]}'
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50 font-mono text-sm resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* === HEADER === */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dracula-foreground">
            Projects Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-dracula-comment mt-1">
            Manage your portfolio projects and case studies
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 dark:bg-dracula-purple hover:bg-orange-600 dark:hover:bg-dracula-purple/80 text-white transition-colors self-start sm:self-auto">
          <Plus size={16} />
          <span>Add Project</span>
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
                  ? "bg-green-100 dark:bg-dracula-green/10 border border-green-300 dark:border-dracula-green/30"
                  : "bg-red-100 dark:bg-dracula-red/10 border border-red-300 dark:border-dracula-red/30"
              }
            `}>
            {notification.type === "success" ? (
              <CheckCircle size={20} className="text-green-600 dark:text-dracula-green" />
            ) : (
              <AlertCircle size={20} className="text-red-600 dark:text-dracula-red" />
            )}
            <span
              className={
                notification.type === "success"
                  ? "text-green-700 dark:text-dracula-green"
                  : "text-red-700 dark:text-dracula-red"
              }>
              {notification.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === SEARCH & FILTERS === */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dracula-comment"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-dracula-selection bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-dracula-purple/50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 dark:bg-dracula-purple text-white"
                    : "bg-gray-100 dark:bg-dracula-selection text-gray-600 dark:text-dracula-comment hover:bg-gray-200 dark:hover:bg-dracula-comment/20"
                }
              `}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* === PROJECTS LIST === */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={24} className="animate-spin text-gray-400 dark:text-dracula-comment" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-dracula-comment">
          <FolderGit2 size={48} className="mx-auto mb-4 opacity-50" />
          <p>No projects found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-xl border border-gray-200 dark:border-dracula-selection bg-white dark:bg-dracula-background/50 hover:border-orange-400 dark:hover:border-dracula-purple/50 transition-all group shadow-sm">
              <div className="flex flex-col lg:flex-row gap-5">
                {/* Thumbnail */}
                <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-dracula-selection flex-shrink-0">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderGit2 size={32} className="text-gray-400 dark:text-dracula-comment" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title và badges */}
                  <div className="flex flex-wrap items-start gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-dracula-foreground">
                      {project.title}
                    </h3>
                    {project.isFeatured && (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-yellow-100 dark:bg-dracula-yellow/20 text-yellow-700 dark:text-dracula-yellow border border-yellow-300 dark:border-dracula-yellow/30">
                        <Star size={10} />
                        Featured
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full border ${getCategoryStyle(
                        project.category
                      )}`}>
                      {project.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full border ${getStatusStyle(
                        project.status
                      )}`}>
                      {statusOptions.find((s) => s.value === project.status)?.label ||
                        project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-dracula-comment mb-3 line-clamp-2">
                    {project.shortDescription}
                  </p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-dracula-selection text-cyan-600 dark:text-dracula-cyan">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-dracula-selection text-gray-500 dark:text-dracula-comment">
                          +{project.technologies.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Links và dates */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-dracula-comment">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-dracula-foreground transition-colors">
                        <Github size={14} />
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-dracula-foreground transition-colors">
                        <ExternalLink size={14} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.videoUrl && (
                      <a
                        href={project.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-dracula-foreground transition-colors">
                        <Video size={14} />
                        <span>Video</span>
                      </a>
                    )}
                    {project.projectDate && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {new Date(project.projectDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs">
                      <Grip size={12} />
                      Order: {project.displayOrder}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 justify-end lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-dracula-selection hover:bg-orange-500/20 dark:hover:bg-dracula-purple/20 text-gray-600 dark:text-dracula-comment hover:text-orange-600 dark:hover:text-dracula-cyan transition-colors">
                    <Edit3 size={16} />
                    <span className="lg:hidden">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-dracula-selection hover:bg-red-100 dark:hover:bg-dracula-red/10 text-gray-600 dark:text-dracula-comment hover:text-red-600 dark:hover:text-dracula-red transition-colors">
                    <Trash2 size={16} />
                    <span className="lg:hidden">Delete</span>
                  </button>
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl my-8 bg-white dark:bg-dracula-current rounded-xl border border-gray-200 dark:border-dracula-selection shadow-2xl overflow-hidden">
              {/* Modal header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-dracula-selection flex items-center justify-between sticky top-0 bg-white dark:bg-dracula-current z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-dracula-green/20 flex items-center justify-center">
                    <FolderGit2 size={20} className="text-green-600 dark:text-dracula-green" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-dracula-foreground">
                      {editingProject ? "Edit Project" : "Add New Project"}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-dracula-comment">
                      {editingProject
                        ? "Update project details"
                        : "Add a new project to your portfolio"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dracula-selection text-gray-500 dark:text-dracula-comment hover:text-gray-900 dark:hover:text-dracula-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="px-6 pt-4 border-b border-gray-200 dark:border-dracula-selection">
                <div className="flex gap-1 overflow-x-auto">
                  {modalTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap
                        ${
                          activeTab === tab.id
                            ? "bg-orange-500 dark:bg-dracula-purple text-white"
                            : "text-gray-600 dark:text-dracula-comment hover:bg-gray-100 dark:hover:bg-dracula-selection"
                        }
                      `}>
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal content */}
              <div className="p-6 max-h-[50vh] overflow-y-auto">{renderTabContent()}</div>

              {/* Modal footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-dracula-selection flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-dracula-current">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-dracula-selection text-gray-600 dark:text-dracula-comment hover:text-gray-900 dark:hover:text-dracula-foreground hover:bg-gray-100 dark:hover:bg-dracula-selection transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 dark:bg-dracula-green hover:bg-green-700 dark:hover:bg-dracula-green/80 text-white transition-colors disabled:opacity-50">
                  {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{isSaving ? "Saving..." : "Save Project"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsManagement;
