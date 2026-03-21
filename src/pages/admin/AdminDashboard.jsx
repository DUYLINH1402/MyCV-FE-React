// ========================================
// PAGE: Admin Dashboard
// Trang quản trị chính với layout IntelliJ-style
// Bao gồm Sidebar navigation và content area
// ========================================

import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  User,
  Code2,
  FolderGit2,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Activity,
  Database,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "./components/AdminSidebar";

/**
 * AdminDashboard Component
 * Layout chính cho trang quản trị với sidebar và content area
 * Thiết kế theo phong cách IntelliJ IDE
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoggedIn } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Redirect về login nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Menu items cho sidebar
  const menuItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: Activity,
      path: "/admin",
      description: "System overview",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/admin/profile",
      description: "Personal info",
    },
    {
      id: "skills",
      label: "Skills",
      icon: Code2,
      path: "/admin/skills",
      description: "Tech stack",
    },
    {
      id: "experiences",
      label: "Experiences",
      icon: Briefcase,
      path: "/admin/experiences",
      description: "Work history",
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderGit2,
      path: "/admin/projects",
      description: "Portfolio",
    },
  ];

  // Lấy current page từ path
  const getCurrentPage = () => {
    const currentItem = menuItems.find((item) => item.path === location.pathname);
    return currentItem || menuItems[0];
  };

  return (
    <div className="min-h-screen bg-dracula-background text-dracula-foreground font-mono flex">
      {/* === SIDEBAR === */}
      <AdminSidebar
        menuItems={menuItems}
        currentPath={location.pathname}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={handleLogout}
      />

      {/* === MOBILE MENU OVERLAY === */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* === MOBILE SIDEBAR === */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25 }}
            className="lg:hidden fixed left-0 top-0 h-full z-50">
            <AdminSidebar
              menuItems={menuItems}
              currentPath={location.pathname}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              onLogout={handleLogout}
              isMobile={true}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MAIN CONTENT AREA === */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}>
        {/* === TOP BAR === */}
        <header className="h-14 bg-dracula-current border-b border-dracula-selection flex items-center justify-between px-4 sticky top-0 z-30">
          {/* Left side - Mobile menu button và Breadcrumb */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-dracula-selection rounded-lg transition-colors">
              <Menu size={20} className="text-dracula-foreground" />
            </button>

            {/* Breadcrumb với style terminal */}
            <div className="flex items-center gap-2 text-sm">
              <Terminal size={16} className="text-dracula-green" />
              <span className="text-dracula-comment">admin@portfolio</span>
              <ChevronRight size={14} className="text-dracula-comment" />
              <span className="text-dracula-cyan">{getCurrentPage().label.toLowerCase()}</span>
              <span className="text-dracula-green animate-pulse">▊</span>
            </div>
          </div>

          {/* Right side - Status indicators */}
          <div className="flex items-center gap-4">
            {/* Database status */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-dracula-comment">
              <Database size={14} className="text-dracula-green" />
              <span>Connected</span>
            </div>

            {/* Current time */}
            <div className="hidden md:flex items-center gap-2 text-xs text-dracula-comment">
              <Clock size={14} />
              <span>
                {currentTime.toLocaleTimeString("en-US", {
                  hour12: false,
                })}
              </span>
            </div>

            {/* Session status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-dracula-green/10 rounded-full">
              <CheckCircle size={14} className="text-dracula-green" />
              <span className="text-xs text-dracula-green font-medium">Session Active</span>
            </div>
          </div>
        </header>

        {/* === PAGE CONTENT === */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Tab bar giả lập IntelliJ */}
          <div className="mb-6 flex items-center gap-1 bg-dracula-current rounded-t-lg p-1 border-b border-dracula-selection">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm transition-all ${
                    isActive
                      ? "bg-dracula-background text-dracula-foreground border-t-2 border-dracula-purple"
                      : "text-dracula-comment hover:text-dracula-foreground hover:bg-dracula-selection/50"
                  }`}>
                  <Icon size={14} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-2 w-2 h-2 rounded-full bg-dracula-green animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content container với style IDE */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-dracula-current rounded-lg border border-dracula-selection shadow-xl min-h-[calc(100vh-200px)]">
            {/* Outlet cho nested routes */}
            <Outlet />
          </motion.div>
        </main>

        {/* === STATUS BAR (IntelliJ style) === */}
        <footer className="h-8 bg-dracula-current border-t border-dracula-selection flex items-center justify-between px-4 text-xs text-dracula-comment">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-dracula-green"></span>
              Ready
            </span>
            <span>UTF-8</span>
            <span>LF</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Admin Panel v1.0.0</span>
            <span>React 19.2.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
