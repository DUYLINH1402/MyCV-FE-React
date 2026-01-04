import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ========================================
// COMPONENT: IntroScreen - Màn hình giới thiệu khi vào trang
// Hiển thị tên và role với animation, sau đó fade out
// ========================================
const IntroScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  // Phase 0: Hiển thị tên
  // Phase 1: Hiển thị role
  // Phase 2: Fade out và chuyển vào trang chính

  useEffect(() => {
    // Timeline animation
    const timers = [
      // Sau 1.5s hiển thị role
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
            {/* Tên */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-dracula-foreground tracking-wider">
              NGUYEN DUY LINH
            </motion.h1>

            {/* Role - luôn chiếm không gian, chỉ thay đổi opacity */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-4 text-lg md:text-xl text-gray-500 dark:text-dracula-comment tracking-[0.3em] font-mono h-7">
              BACKEND DEVELOPER
            </motion.p>
          </div>

          {/* Loading indicator nhỏ ở dưới */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ duration: 3, ease: "linear" }}
            className="absolute bottom-20 h-[2px] bg-gradient-to-r from-orange-500 to-purple-600 dark:to-dracula-purple"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
