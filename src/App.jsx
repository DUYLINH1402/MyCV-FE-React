// ========================================
// MAIN COMPONENT: App
// Cấu hình routing cho toàn bộ ứng dụng
// Sử dụng React Router để điều hướng giữa các trang
// ========================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfileProvider, AuthProvider } from "./context";
import { ProtectedRoute } from "./components";
import {
  HomePage,
  AdminDashboard,
  DashboardOverview,
  ProfileManagement,
  SkillsManagement,
  ProjectsManagement,
} from "./pages";

/**
 * App Component
 * Root component với routing configuration
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <Routes>
            {/* === PUBLIC ROUTES === */}
            {/* Trang chủ Portfolio */}
            <Route path="/" element={<HomePage />} />

            {/* === PROTECTED ROUTES (Admin) === */}
            {/* Tất cả routes /admin/* đều yêu cầu đăng nhập */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }>
              {/* Nested routes cho Admin Dashboard */}
              {/* Dashboard Overview - Trang mặc định khi vào /admin */}
              <Route index element={<DashboardOverview />} />

              {/* Profile Management */}
              <Route path="profile" element={<ProfileManagement />} />

              {/* Skills Management */}
              <Route path="skills" element={<SkillsManagement />} />

              {/* Projects Management */}
              <Route path="projects" element={<ProjectsManagement />} />
            </Route>

            {/* === 404 NOT FOUND === */}
            {/* Redirect về trang chủ nếu route không tồn tại */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
