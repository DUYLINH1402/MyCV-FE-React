// ========================================
// PAGE: Profile Management
// Quản lý thông tin cá nhân với form style IntelliJ
// Bao gồm: Avatar, tên, bio, links, v.v.
// ========================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Github,
  Linkedin,
  Save,
  RefreshCw,
  Camera,
  CheckCircle,
  AlertCircle,
  Edit3,
  FileText,
  Terminal,
  Briefcase,
  GraduationCap,
  Award,
  FolderKanban,
  Clock,
} from "lucide-react";
import { useProfile } from "../../../context/ProfileContext";
import { useAuth } from "../../../context/AuthContext";
import { updateProfile } from "../../../services/profileService";

/**
 * ProfileManagement Component
 * Form quản lý thông tin cá nhân
 * Các fields theo đúng API response từ backend
 */
const ProfileManagement = () => {
  const { profile, loading: profileLoading, error: profileError, refreshProfile } = useProfile();
  const { getToken } = useAuth();

  // Form state - theo đúng cấu trúc API response
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    bio: "",
    professionalSummary: "",
    experienceYears: "",
    totalProjects: "",
    educationSummary: "",
    certSummary: "",
    email: "",
    phoneNumber: "",
    githubUrl: "",
    linkedinUrl: "",
    avatarUrl: "",
  });

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [terminalLogs, setTerminalLogs] = useState([]);

  // Load profile data vào form
  // Map đúng theo cấu trúc API response từ backend
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        title: profile.title || "",
        bio: profile.bio || "",
        professionalSummary: profile.professionalSummary || "",
        experienceYears: profile.experienceYears || "",
        totalProjects: profile.totalProjects || "",
        educationSummary: profile.educationSummary || "",
        certSummary: profile.certSummary || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        githubUrl: profile.githubUrl || "",
        linkedinUrl: profile.linkedinUrl || "",
        avatarUrl: profile.avatarUrl || "",
      });
    }
  }, [profile]);

  // Thêm log vào terminal
  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    setTerminalLogs((prev) => [...prev.slice(-9), { id: Date.now(), type, message, timestamp }]);
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý save
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    setTerminalLogs([]);

    try {
      addLog("INFO", "Initializing profile update...");
      addLog("DEBUG", "Validating form data...");

      // Chuẩn bị dữ liệu theo đúng cấu trúc API backend yêu cầu
      const updateData = {
        fullName: formData.fullName,
        title: formData.title,
        bio: formData.bio,
        professionalSummary: formData.professionalSummary,
        experienceYears: formData.experienceYears,
        totalProjects: formData.totalProjects,
        educationSummary: formData.educationSummary,
        certSummary: formData.certSummary,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        avatarUrl: formData.avatarUrl,
      };

      addLog("INFO", "PUT /api/v1/profile");
      addLog("DEBUG", `Payload size: ${JSON.stringify(updateData).length} bytes`);

      // Gọi API
      const token = getToken();
      await updateProfile(updateData, token);

      addLog("SUCCESS", "Profile updated successfully!");
      addLog("INFO", "Refreshing data...");

      // Refresh profile data
      await refreshProfile();

      setSaveStatus("success");
      setIsEditing(false);
    } catch (error) {
      addLog("ERROR", `Update failed: ${error.message}`);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  // Xử lý cancel
  // Reset form về dữ liệu gốc từ API
  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        title: profile.title || "",
        bio: profile.bio || "",
        professionalSummary: profile.professionalSummary || "",
        experienceYears: profile.experienceYears || "",
        totalProjects: profile.totalProjects || "",
        educationSummary: profile.educationSummary || "",
        certSummary: profile.certSummary || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        githubUrl: profile.githubUrl || "",
        linkedinUrl: profile.linkedinUrl || "",
        avatarUrl: profile.avatarUrl || "",
      });
    }
    setIsEditing(false);
    setTerminalLogs([]);
  };

  // Color mapping cho log types
  const logColors = {
    INFO: "text-dracula-cyan",
    DEBUG: "text-dracula-comment",
    SUCCESS: "text-dracula-green",
    WARN: "text-dracula-orange",
    ERROR: "text-dracula-red",
  };

  // Input field component
  const InputField = ({ name, label, icon: Icon, type = "text", placeholder, disabled }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm text-dracula-comment">
        <Icon size={14} />
        <span>{label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled || !isEditing}
        className={`
          w-full px-4 py-3 rounded-lg border
          bg-dracula-background text-dracula-foreground
          placeholder:text-dracula-comment/50
          focus:outline-none focus:ring-2 focus:ring-dracula-purple/50
          transition-all duration-200
          ${
            isEditing
              ? "border-dracula-selection hover:border-dracula-purple/50"
              : "border-transparent bg-dracula-current cursor-not-allowed opacity-70"
          }
        `}
      />
    </div>
  );

  if (profileLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-dracula-comment">
          <RefreshCw size={20} className="animate-spin" />
          <span>Loading profile data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* === HEADER === */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dracula-foreground">Profile Management</h1>
          <p className="text-sm text-dracula-comment mt-1">
            Manage your personal information and social links
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dracula-purple hover:bg-dracula-purple/80 text-white transition-colors">
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dracula-selection hover:bg-dracula-selection text-dracula-foreground transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dracula-green hover:bg-dracula-green/80 text-dracula-background transition-colors disabled:opacity-50">
                {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* === STATUS MESSAGE === */}
      {saveStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            flex items-center gap-3 p-4 rounded-lg
            ${
              saveStatus === "success"
                ? "bg-dracula-green/10 border border-dracula-green/30"
                : "bg-dracula-red/10 border border-dracula-red/30"
            }
          `}>
          {saveStatus === "success" ? (
            <CheckCircle size={20} className="text-dracula-green" />
          ) : (
            <AlertCircle size={20} className="text-dracula-red" />
          )}
          <span className={saveStatus === "success" ? "text-dracula-green" : "text-dracula-red"}>
            {saveStatus === "success"
              ? "Profile updated successfully!"
              : "Failed to update profile. Please try again."}
          </span>
        </motion.div>
      )}

      {/* === FORM CONTENT === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Avatar & Social Links */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6">
          {/* Avatar Section */}
          <div className="p-5 rounded-xl border border-dracula-selection bg-dracula-background/50">
            <h3 className="text-lg font-semibold text-dracula-foreground mb-4 flex items-center gap-2">
              <Camera size={18} className="text-dracula-purple" />
              Profile Photo
            </h3>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-dracula-purple/30 bg-dracula-selection">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={48} className="text-dracula-comment" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-dracula-purple flex items-center justify-center hover:bg-dracula-purple/80 transition-colors">
                    <Camera size={18} className="text-white" />
                  </button>
                )}
              </div>
              {isEditing && (
                <input
                  type="text"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="Avatar URL"
                  className="w-full px-3 py-2 rounded-lg border border-dracula-selection bg-dracula-background text-dracula-foreground text-sm placeholder:text-dracula-comment/50 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50"
                />
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="p-5 rounded-xl border border-dracula-selection bg-dracula-background/50 space-y-4">
            <h3 className="text-lg font-semibold text-dracula-foreground mb-4 flex items-center gap-2">
              <Github size={18} className="text-dracula-cyan" />
              Social Links
            </h3>
            <InputField
              name="githubUrl"
              label="GitHub URL"
              icon={Github}
              placeholder="https://github.com/username"
            />
            <InputField
              name="linkedinUrl"
              label="LinkedIn URL"
              icon={Linkedin}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Experience Stats */}
          <div className="p-5 rounded-xl border border-dracula-selection bg-dracula-background/50 space-y-4">
            <h3 className="text-lg font-semibold text-dracula-foreground mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-dracula-orange" />
              Experience Stats
            </h3>
            <InputField
              name="experienceYears"
              label="Years of Experience"
              icon={Clock}
              placeholder="1+"
            />
            <InputField
              name="totalProjects"
              label="Total Projects"
              icon={FolderKanban}
              placeholder="3+"
            />
          </div>
        </motion.div>

        {/* Right Column - Form Fields */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="p-5 rounded-xl border border-dracula-selection bg-dracula-background/50 space-y-4">
            <h3 className="text-lg font-semibold text-dracula-foreground mb-4 flex items-center gap-2">
              <User size={18} className="text-dracula-green" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="fullName"
                label="Full Name"
                icon={User}
                placeholder="NGUYEN DUY LINH"
              />
              <InputField
                name="title"
                label="Job Title"
                icon={Briefcase}
                placeholder="Backend Engineer"
              />
              <InputField
                name="email"
                label="Email"
                icon={Mail}
                type="email"
                placeholder="email@example.com"
              />
              <InputField
                name="phoneNumber"
                label="Phone Number"
                icon={Phone}
                type="tel"
                placeholder="09092981378"
              />
            </div>
          </div>

          {/* Bio & Professional Summary */}
          <div className="p-5 rounded-xl border border-dracula-selection bg-dracula-background/50 space-y-4">
            <h3 className="text-lg font-semibold text-dracula-foreground mb-4 flex items-center gap-2">
              <FileText size={18} className="text-dracula-pink" />
              Bio & Summary
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-dracula-comment">
                  <FileText size={14} />
                  <span>Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Brief introduction about yourself..."
                  disabled={!isEditing}
                  rows={3}
                  className={`
                    w-full px-4 py-3 rounded-lg border resize-none
                    bg-dracula-background text-dracula-foreground
                    placeholder:text-dracula-comment/50
                    focus:outline-none focus:ring-2 focus:ring-dracula-purple/50
                    transition-all duration-200
                    ${
                      isEditing
                        ? "border-dracula-selection hover:border-dracula-purple/50"
                        : "border-transparent bg-dracula-current cursor-not-allowed opacity-70"
                    }
                  `}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-dracula-comment">
                  <Briefcase size={14} />
                  <span>Professional Summary</span>
                </label>
                <textarea
                  name="professionalSummary"
                  value={formData.professionalSummary}
                  onChange={handleChange}
                  placeholder="Your professional philosophy or summary..."
                  disabled={!isEditing}
                  rows={3}
                  className={`
                    w-full px-4 py-3 rounded-lg border resize-none
                    bg-dracula-background text-dracula-foreground
                    placeholder:text-dracula-comment/50
                    focus:outline-none focus:ring-2 focus:ring-dracula-purple/50
                    transition-all duration-200
                    ${
                      isEditing
                        ? "border-dracula-selection hover:border-dracula-purple/50"
                        : "border-transparent bg-dracula-current cursor-not-allowed opacity-70"
                    }
                  `}
                />
              </div>
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="p-5 rounded-xl border border-dracula-selection bg-dracula-background/50 space-y-4">
            <h3 className="text-lg font-semibold text-dracula-foreground mb-4 flex items-center gap-2">
              <GraduationCap size={18} className="text-dracula-cyan" />
              Education & Certifications
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-dracula-comment">
                  <GraduationCap size={14} />
                  <span>Education Summary</span>
                </label>
                <textarea
                  name="educationSummary"
                  value={formData.educationSummary}
                  onChange={handleChange}
                  placeholder="Your education background..."
                  disabled={!isEditing}
                  rows={2}
                  className={`
                    w-full px-4 py-3 rounded-lg border resize-none
                    bg-dracula-background text-dracula-foreground
                    placeholder:text-dracula-comment/50
                    focus:outline-none focus:ring-2 focus:ring-dracula-purple/50
                    transition-all duration-200
                    ${
                      isEditing
                        ? "border-dracula-selection hover:border-dracula-purple/50"
                        : "border-transparent bg-dracula-current cursor-not-allowed opacity-70"
                    }
                  `}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-dracula-comment">
                  <Award size={14} />
                  <span>Certifications Summary</span>
                </label>
                <textarea
                  name="certSummary"
                  value={formData.certSummary}
                  onChange={handleChange}
                  placeholder="Your certifications..."
                  disabled={!isEditing}
                  rows={2}
                  className={`
                    w-full px-4 py-3 rounded-lg border resize-none
                    bg-dracula-background text-dracula-foreground
                    placeholder:text-dracula-comment/50
                    focus:outline-none focus:ring-2 focus:ring-dracula-purple/50
                    transition-all duration-200
                    ${
                      isEditing
                        ? "border-dracula-selection hover:border-dracula-purple/50"
                        : "border-transparent bg-dracula-current cursor-not-allowed opacity-70"
                    }
                  `}
                />
              </div>
            </div>
          </div>

          {/* Terminal Logs (hiển thị khi saving) */}
          {terminalLogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-dracula-selection overflow-hidden">
              {/* Terminal header */}
              <div className="px-4 py-3 bg-dracula-current border-b border-dracula-selection flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-dracula-red" />
                  <span className="w-3 h-3 rounded-full bg-dracula-yellow" />
                  <span className="w-3 h-3 rounded-full bg-dracula-green" />
                </div>
                <div className="flex items-center gap-2 text-sm text-dracula-comment">
                  <Terminal size={14} />
                  <span>profile-update.log</span>
                </div>
              </div>

              {/* Terminal content */}
              <div className="p-4 bg-dracula-background font-mono text-sm max-h-40 overflow-y-auto">
                {terminalLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 py-0.5">
                    <span className="text-dracula-comment">[{log.timestamp}]</span>
                    <span className={`font-semibold ${logColors[log.type]}`}>[{log.type}]</span>
                    <span className="text-dracula-foreground">{log.message}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileManagement;
