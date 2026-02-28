// ========================================
// Export tất cả components từ một điểm duy nhất
// Giúp import dễ dàng hơn trong các file khác
// ========================================

// Common components (Button, Badge, SectionTitle)
export * from "./common";

// Layout components (Header, Footer)
export * from "./layout";

// UI components (IntelliJMockup, SpringBootTerminal)
export * from "./ui";

// LightRays - Hiệu ứng tia sáng cho Dark Mode
export { default as LightRays } from "./LightRays";

// ProtectedRoute - Bảo vệ các route yêu cầu đăng nhập
export { default as ProtectedRoute } from "./ProtectedRoute";
