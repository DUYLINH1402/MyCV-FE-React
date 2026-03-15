// ========================================
// PAGE: Home Page
// Trang chủ Portfolio - Tách từ App.jsx để dùng với Router
// ========================================

import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Header,
  Footer,
  IntroScreen,
  LightRays,
  LoginModal,
  DatabaseSchema,
  DatabaseSchemaMobile,
  ScrollFloat,
} from "../components";
import { Hero, About, Skills, Projects, Architecture, Contact } from "../sections";
import { useAuth } from "../context";
import { useNavigate } from "react-router-dom";

/**
 * HomePage Component
 * Trang chủ Portfolio với tất cả các sections
 */
const HomePage = () => {
  const navigate = useNavigate();
  // Lấy cả isLoading để đảm bảo đợi checkAuth hoàn thành trước khi redirect
  const { isLoggedIn, isLoading } = useAuth();

  // State để kiểm tra đã qua màn hình intro chưa
  const [showIntro, setShowIntro] = useState(true);
  // State để lưu vị trí chuột cho hiệu ứng spotlight
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // State để bật tắt dark mode (Mặc định là true - Dark mode)
  const [isDarkMode, setIsDarkMode] = useState(true);
  // State để điều khiển Login Modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Ref để lưu chuỗi ký tự đã gõ (dùng cho secret login trigger)
  const keySequenceRef = useRef("");

  // Effect: Tự động chuyển hướng đến Admin Dashboard nếu đã đăng nhập
  // Chỉ chạy sau khi checkAuth hoàn thành (isLoading = false)
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate("/admin", { replace: true });
    }
  }, [isLoggedIn, isLoading, navigate]);

  // Effect: Tự động cuộn lên đầu trang khi reload/mount
  useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // Effect: Lắng nghe keyboard để mở Login Modal khi gõ LOGIN_WORD
  useEffect(() => {
    let resetTimer;
    const LOGIN_WORD = (import.meta.env.VITE_LOGIN_WORD || "login").toLowerCase();

    const handleKeyDown = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable ||
        isLoginModalOpen
      ) {
        return;
      }

      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        keySequenceRef.current += e.key.toLowerCase();

        if (keySequenceRef.current.length > LOGIN_WORD.length) {
          keySequenceRef.current = keySequenceRef.current.slice(-LOGIN_WORD.length);
        }

        if (keySequenceRef.current === LOGIN_WORD) {
          setIsLoginModalOpen(true);
          keySequenceRef.current = "";
        }

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          keySequenceRef.current = "";
        }, 2000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(resetTimer);
    };
  }, [isLoginModalOpen]);

  // Effect: Lắng nghe sự kiện di chuyển chuột
  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  // Effect: Cập nhật class 'dark' vào thẻ <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Effect: Khởi tạo Lenis smooth scroll
  useEffect(() => {
    if (showIntro) return;

    const lenis = new Lenis({
      duration: 0.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [showIntro]);

  // Effect: Khởi tạo AOS
  useEffect(() => {
    if (showIntro) return;

    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 100,
      delay: 0,
      anchorPlacement: "top-bottom",
    });

    AOS.refresh();
  }, [showIntro]);

  // Hàm toggle theme
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Callback khi login thành công - chuyển hướng đến Admin Dashboard
  const handleLoginSuccess = () => {
    console.log("[SUCCESS] Admin logged in successfully");
    // Chuyển hướng đến trang Admin Dashboard
    navigate("/admin");
  };

  return (
    <>
      {/* === INTRO SCREEN === */}
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}

      {/* Container chính */}
      <div
        className={`min-h-screen font-mono transition-colors duration-300 relative overflow-hidden pb-20 ${
          isDarkMode
            ? "dark bg-dracula-background text-dracula-foreground"
            : "bg-gray-50 text-gray-900"
        }`}
        style={{
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
        }}>
        {/* === SPOTLIGHT EFFECT === */}
        <div className="pointer-events-none fixed inset-0 z-30 transition duration-300 mouse-spotlight dark:opacity-100 opacity-0"></div>

        {/* === LIGHT RAYS EFFECT === */}
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

        {/* === HEADER === */}
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        {/* === MAIN SECTIONS === */}
        <main>
          <Hero onAvatarTripleClick={() => setIsLoginModalOpen(true)} />
          <About />
          <Skills />
          <Projects />
          {/* Section Architecture - responsive cho cả desktop và mobile */}
          <Architecture />
          {/* Section Contact */}
          <Contact />
          {/* Database Schema Animation - Desktop */}
          <div data-aos="fade-up" data-aos-duration="800" className="mt-16">
            <DatabaseSchema className="mx-auto mb-2 hidden lg:block" />
          </div>
          {/* Database Schema Animation - Mobile */}
          <div data-aos="fade-up" data-aos-duration="800" className="mt-8 px-2">
            <DatabaseSchemaMobile className="mx-auto mb-2 block lg:hidden" />
          </div>
        </main>

        {/* === FOOTER === */}
        <Footer />

        {/* === THANK YOU SECTION - Hiệu ứng xuất hiện khi scroll đến cuối === */}
        <section className="min-h-[100vh] flex items-center justify-center ">
          <ScrollFloat
            containerClassName="text-center"
            textClassName="font-sans font-black tracking-tight text-gray-800 dark:text-white !text-[clamp(3rem,10vw,8rem)]"
            animationDuration={1.2}
            ease="back.inOut(1.7)"
            scrollStart="top bottom"
            scrollEnd="center center"
            stagger={0.04}>
            Thank You!
          </ScrollFloat>
        </section>

        {/* === LOGIN MODAL === */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </>
  );
};

export default HomePage;
