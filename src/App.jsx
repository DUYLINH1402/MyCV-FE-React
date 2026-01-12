import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import AOS from "aos";
import "aos/dist/aos.css";
import { Header, Footer, ConsoleLogsStream, IntroScreen, LightRays } from "./components";
import { Hero, About, Skills, Projects } from "./sections";
import SystemArchitecture from "./components/ui/SystemArchitecture";
import { ProfileProvider } from "./context";

// ========================================
// MAIN COMPONENT: App
// Tổng hợp tất cả các sections và layout components
// Sử dụng ProfileProvider để chia sẻ dữ liệu profile từ API
// ========================================
function App() {
  // Effect: Tự động cuộn lên đầu trang khi reload/mount
  useEffect(() => {
    window.scrollTo(0, 0);
    // Đảm bảo scroll reset ngay cả với history scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);
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
      duration: 0.5, // Thời gian scroll (giây) - càng cao càng chậm
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

  // Effect: Khởi tạo AOS (Animate On Scroll) - tạo hiệu ứng xuất hiện khi cuộn trang
  useEffect(() => {
    // Chỉ khởi tạo AOS sau khi intro screen kết thúc
    if (showIntro) return;

    AOS.init({
      duration: 800, // Thời gian animation (ms)
      easing: "ease-out-cubic", // Easing mượt mà
      once: false, // false = animation lặp lại khi scroll lên/xuống
      mirror: true, // Cho phép animation khi scroll ngược lên
      offset: 100, // Khoảng cách trigger (px)
      delay: 0, // Delay mặc định
      anchorPlacement: "top-bottom", // Vị trí anchor
    });

    // Refresh AOS khi DOM thay đổi
    AOS.refresh();

    // Cleanup
    return () => {
      // AOS không có destroy method, chỉ cần refresh
    };
  }, [showIntro]);

  // Hàm toggle theme để truyền xuống Header
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ProfileProvider>
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

        {/* === LIGHT RAYS EFFECT - Chỉ hiển thị ở Dark Mode === */}
        {/* Hiệu ứng tia sáng phát ra từ trên xuống, tạo cảm giác chuyên nghiệp */}
        {isDarkMode && (
          <div className="fixed inset-0 z-200 pointer-events-none">
            <LightRays
              raysOrigin="top-center"
              raysColor="#8be9fd"
              raysSpeed={0.8}
              lightSpread={1.2}
              rayLength={1.5}
              followMouse={true}
              mouseInfluence={0.3}
              noiseAmount={0.05}
              distortion={0.02}
              fadeDistance={1.2}
              saturation={0.9}
            />
          </div>
        )}

        {/* === HEADER với Navigation === */}
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        {/* === CÁC SECTIONS === */}
        <main>
          {/* Hero Section - Phần giới thiệu đầu tiên */}
          <Hero />

          {/* About Section - Giới thiệu về bản thân */}
          <About />

          {/* System Architecture Section - Kiến trúc hệ thống */}
          {/* Ẩn trên mobile vì sơ đồ quá nhỏ, chỉ hiển thị từ màn hình lg trở lên */}
          <div className="hidden lg:block">
            <SystemArchitecture />
          </div>

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
    </ProfileProvider>
  );
}

export default App;
