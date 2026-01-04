import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { Header, Footer, ConsoleLogsStream, IntroScreen } from "./components";
import { Hero, About, Skills, Projects } from "./sections";
import SystemArchitecture from "./components/ui/SystemArchitecture";

// ========================================
// MAIN COMPONENT: App
// Tổng hợp tất cả các sections và layout components
// ========================================
function App() {
  // State để kiểm tra đã qua màn hình intro chưa
  const [showIntro, setShowIntro] = useState(true);
  // State để lưu vị trí chuột cho hiệu ứng spotlight
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // State để bật tắt dark mode (Mặc định là true - Dark mode)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Effect: Lắng nghe sự kiện di chuyển chuột trên toàn màn hình
  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  // Effect: Cập nhật class 'dark' vào thẻ <html> khi state thay đổi
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Effect: Khởi tạo Lenis smooth scroll - mượt mà như các website cao cấp
  useEffect(() => {
    // Chỉ khởi tạo Lenis sau khi intro screen kết thúc
    if (showIntro) return;

    const lenis = new Lenis({
      duration: 2, // Thời gian scroll (giây) - càng cao càng chậm
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing mượt mà
      orientation: "vertical", // Hướng scroll
      smoothWheel: true, // Smooth scroll với lăn chuột
      wheelMultiplier: 1, // Tốc độ lăn chuột
      touchMultiplier: 2, // Tốc độ trên thiết bị cảm ứng
      infinite: false, // Không loop vô hạn
    });

    // Animation frame loop để cập nhật Lenis
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup khi component unmount
    return () => {
      lenis.destroy();
    };
  }, [showIntro]);

  // Hàm toggle theme để truyền xuống Header
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <>
      {/* === INTRO SCREEN === */}
      {/* Màn hình giới thiệu khi vào trang */}
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}

      {/* Container chính với biến CSS vị trí chuột cho hiệu ứng spotlight */}
      <div
        className={`min-h-screen font-mono transition-colors duration-300 relative overflow-hidden ${
          isDarkMode
            ? "dark bg-dracula-background text-dracula-foreground"
            : "bg-gray-50 text-gray-900"
        }`}
        style={{
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
        }}>
        {/* === LỚP CHỨA HIỆU ỨNG SPOTLIGHT === */}
        <div className="pointer-events-none fixed inset-0 z-30 transition duration-300 mouse-spotlight dark:opacity-100 opacity-0"></div>

        {/* === HEADER với Navigation === */}
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        {/* === CÁC SECTIONS === */}
        <main>
          {/* Hero Section - Phần giới thiệu đầu tiên */}
          <Hero />

          {/* About Section - Giới thiệu về bản thân */}
          <About />

          {/* System Architecture Section - Kiến trúc hệ thống */}
          <SystemArchitecture />

          {/* Skills Section - Kỹ năng chuyên môn */}
          <Skills />

          {/* Projects Section - Các dự án đã thực hiện */}
          <Projects />
        </main>

        {/* === FOOTER === */}
        <Footer />

        {/* === CONSOLE LOGS STREAM === */}
        {/* Hiển thị Spring Boot logs ở dưới màn hình, chạy khi cuộn trang */}
        <ConsoleLogsStream />
      </div>
    </>
  );
}

export default App;
