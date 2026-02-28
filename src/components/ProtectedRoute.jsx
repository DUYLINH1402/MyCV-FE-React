// ========================================
// COMPONENT: Protected Route
// Bảo vệ các route yêu cầu đăng nhập
// Redirect về trang chủ nếu chưa đăng nhập
// ========================================

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RefreshCw } from "lucide-react";

/**
 * ProtectedRoute Component
 * Wrap các route cần authentication
 * @param {ReactNode} children - Component con cần bảo vệ
 */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  // Hiển thị loading khi đang kiểm tra auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dracula-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw size={32} className="animate-spin text-dracula-purple" />
          <p className="text-dracula-comment font-mono">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Redirect về trang chủ nếu chưa đăng nhập
  if (!isLoggedIn) {
    // Lưu lại intended route để redirect sau khi login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
