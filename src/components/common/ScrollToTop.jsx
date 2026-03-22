import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

// ========================================
// COMPONENT: ScrollToTop - Nút cuộn lên đầu trang
// Hiển thị khi user scroll xuống quá 400px
// Style đồng bộ với theme IntelliJ Dracula, hỗ trợ light/dark mode
// ========================================
const ScrollToTop = () => {
  // State kiểm tra có nên hiển thị nút hay không
  const [isVisible, setIsVisible] = useState(false);

  // Effect: Lắng nghe sự kiện scroll để toggle visibility
  useEffect(() => {
    const toggleVisibility = () => {
      // Hiển thị nút khi scroll xuống quá 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Đăng ký event listener
    window.addEventListener("scroll", toggleVisibility);

    // Cleanup khi component unmount
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Handler: Cuộn mượt lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          // Animation xuất hiện từ dưới lên
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          // Animation hover và click
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 20px rgba(249, 115, 22, 0.4)",
          }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-3 right-3 z-50 p-2 rounded-full 
            bg-orange-500 text-white shadow-lg shadow-orange-500/30
            hover:bg-orange-600 
            dark:bg-orange-500 dark:hover:bg-orange-600
            border-2 border-orange-400/50 dark:border-orange-400/30
            backdrop-blur-sm
            transition-colors duration-300
            cursor-pointer
            group"
          aria-label="Cuộn lên đầu trang">
          {/* Icon mũi tên lên với animation bounce nhẹ khi hover */}
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}>
            <ArrowUp
              size={24}
              strokeWidth={2.5}
              className="group-hover:stroke-white transition-colors"
            />
          </motion.div>

          {/* Hiệu ứng pulse ring */}
          <span
            className="absolute inset-0 rounded-full bg-orange-500/20 
            animate-ping opacity-75 pointer-events-none"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
