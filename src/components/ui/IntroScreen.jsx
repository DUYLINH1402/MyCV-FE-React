import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlurText from "../common/BlurText";

// ========================================
// COMPONENT: IntroScreen - Màn hình giới thiệu khi vào trang
// Hiển thị tên và role với animation BlurText, sau đó fade out
// ========================================
const IntroScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  // Phase 0: Hiển thị tên
  // Phase 1: Hiển thị role
  // Phase 2: Fade out và chuyển vào trang chính

  useEffect(() => {
    // Timeline animation
    const timers = [
      // Sau 1s hiển thị role
      setTimeout(() => setPhase(1), 1000),
      // Sau 3s bắt đầu fade out
      setTimeout(() => setPhase(2), 3000),
      // Sau 3.8s hoàn thành và gọi callback
      setTimeout(() => onComplete(), 3800),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-gray-50 dark:bg-dracula-background flex flex-col items-center justify-center">
          {/* Container cố định kích thước để tránh layout shift */}
          <div className="flex flex-col items-center">
            {/* Tên - BlurText animation từng từ */}
            <BlurText
              text="NGUYEN DUY LINH"
              delay={150}
              animateBy="words"
              direction="top"
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-dracula-foreground tracking-wider justify-center"
              stepDuration={0.4}
            />

            {/* Role - BlurText animation từng ký tự, xuất hiện sau khi phase >= 1 */}
            {phase >= 1 && (
              <BlurText
                text="BACKEND DEVELOPER"
                delay={50}
                animateBy="characters"
                direction="bottom"
                className="mt-4 text-lg md:text-xl text-gray-500 dark:text-dracula-comment tracking-[0.3em] font-mono justify-center"
                stepDuration={0.3}
              />
            )}
          </div>

          {/* Loading indicator nhỏ ở dưới với border tổng thể - tràn từ giữa ra 2 bên */}
          <div className="absolute bottom-20 w-[120px] h-[6px] rounded-full border border-gray-300 dark:border-dracula-comment/50 overflow-hidden bg-gray-100 dark:bg-dracula-current">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-full w-full origin-center bg-gradient-to-r from-purple-600 via-orange-500 to-purple-600 dark:from-dracula-purple dark:via-orange-500 dark:to-dracula-purple rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
