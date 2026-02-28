// ========================================
// COMPONENT: Admin Sidebar
// Navigation sidebar với phong cách IntelliJ
// Hỗ trợ collapse và mobile responsive
// ========================================

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Terminal, ChevronLeft, ChevronRight, LogOut, X, Coffee, Sparkles } from "lucide-react";

/**
 * AdminSidebar Component
 * @param {Array} menuItems - Danh sách menu items
 * @param {string} currentPath - Path hiện tại
 * @param {boolean} isCollapsed - Trạng thái thu gọn
 * @param {Function} onToggleCollapse - Toggle collapse
 * @param {Function} onLogout - Xử lý đăng xuất
 * @param {boolean} isMobile - Có phải mobile không
 * @param {Function} onCloseMobile - Đóng menu mobile
 */
const AdminSidebar = ({
  menuItems,
  currentPath,
  isCollapsed,
  onToggleCollapse,
  onLogout,
  isMobile = false,
  onCloseMobile,
}) => {
  const navigate = useNavigate();

  // Xử lý click menu item
  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`
        ${isMobile ? "w-64" : isCollapsed ? "w-20" : "w-64"}
        ${isMobile ? "" : "hidden lg:flex"}
        h-screen bg-dracula-current border-r border-dracula-selection
        flex-col fixed left-0 top-0 z-40 transition-all duration-300
      `}>
      {/* === HEADER === */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-dracula-selection">
        {/* Logo và tên */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dracula-purple to-dracula-pink flex items-center justify-center flex-shrink-0">
            <Terminal size={18} className="text-white" />
          </div>
          {(!isCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col">
              <span className="text-sm font-bold text-dracula-foreground">Admin Panel</span>
              <span className="text-xs text-dracula-comment">Nguyễn Duy Linh</span>
            </motion.div>
          )}
        </div>

        {/* Close button cho mobile */}
        {isMobile && (
          <button
            onClick={onCloseMobile}
            className="p-2 hover:bg-dracula-selection rounded-lg transition-colors">
            <X size={18} className="text-dracula-foreground" />
          </button>
        )}

        {/* Toggle button cho desktop */}
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-dracula-selection rounded-lg transition-colors">
            {isCollapsed ? (
              <ChevronRight size={18} className="text-dracula-foreground" />
            ) : (
              <ChevronLeft size={18} className="text-dracula-foreground" />
            )}
          </button>
        )}
      </div>

      {/* === NAVIGATION MENU === */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleMenuClick(item.path)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg
                  transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-dracula-purple/20 text-dracula-purple border-l-2 border-dracula-purple"
                      : "text-dracula-comment hover:text-dracula-foreground hover:bg-dracula-selection/50"
                  }
                `}>
                {/* Icon */}
                <div
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    transition-colors duration-200
                    ${
                      isActive
                        ? "bg-dracula-purple/30"
                        : "bg-dracula-selection group-hover:bg-dracula-selection"
                    }
                  `}>
                  <Icon
                    size={18}
                    className={isActive ? "text-dracula-purple" : "text-dracula-foreground"}
                  />
                </div>

                {/* Label và description */}
                {(!isCollapsed || isMobile) && (
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-sm font-medium truncate">{item.label}</span>
                    <span className="text-xs text-dracula-comment truncate">
                      {item.description}
                    </span>
                  </div>
                )}

                {/* Active indicator dot */}
                {isActive && (!isCollapsed || isMobile) && (
                  <div className="absolute right-3">
                    <span className="w-2 h-2 rounded-full bg-dracula-green block animate-pulse" />
                  </div>
                )}

                {/* Tooltip khi collapsed */}
                {isCollapsed && !isMobile && (
                  <div
                    className="
                      absolute left-full ml-2 px-3 py-2 bg-dracula-background
                      rounded-lg shadow-lg border border-dracula-selection
                      opacity-0 group-hover:opacity-100 pointer-events-none
                      transition-opacity duration-200 whitespace-nowrap z-50
                    ">
                    <span className="text-sm font-medium text-dracula-foreground">
                      {item.label}
                    </span>
                    <span className="block text-xs text-dracula-comment">{item.description}</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* === FOOTER === */}
      <div className="p-3 border-t border-dracula-selection">
        {/* Fun message */}
        {(!isCollapsed || isMobile) && (
          <div className="mb-3 px-3 py-2 bg-dracula-selection/30 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-dracula-comment">
              <Coffee size={14} className="text-dracula-orange" />
              <span>Powered by caffeine</span>
              <Sparkles size={12} className="text-dracula-yellow" />
            </div>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={onLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-lg
            text-dracula-red hover:bg-dracula-red/10
            transition-all duration-200 group
          `}>
          <div className="w-8 h-8 rounded-lg bg-dracula-red/10 flex items-center justify-center flex-shrink-0 group-hover:bg-dracula-red/20">
            <LogOut size={18} />
          </div>
          {(!isCollapsed || isMobile) && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
