import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coffee, Sun, Moon, Menu, X } from "lucide-react";

// ========================================
// COMPONENT: Header - Navigation bar cố định
// Bao gồm logo, menu navigation và nút toggle theme
// ========================================
const Header = ({ isDarkMode, toggleTheme }) => {
  // State để điều khiển mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State để kiểm tra scroll
  const [isScrolled, setIsScrolled] = useState(false);
  // State để ẩn/hiện header khi scroll
  const [isHidden, setIsHidden] = useState(false);
  // Lưu vị trí scroll trước đó
  const [lastScrollY, setLastScrollY] = useState(0);

  // Các mục menu navigation
  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    {
      label: "Architecture",
      href: "#architecture",
      note: "FoodieExpress System",
    },
    { label: "Contact", href: "#contact" },
  ];

  // Effect: Lắng nghe sự kiện scroll để thay đổi style header và ẩn/hiện
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Cập nhật trạng thái scrolled
      setIsScrolled(currentScrollY > 50);

      // Nếu đang ở đầu trang, luôn hiện header
      if (currentScrollY < 50) {
        setIsHidden(false);
      }
      // Scroll xuống -> ẩn header
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      }
      // Scroll lên -> hiện header
      else if (currentScrollY < lastScrollY) {
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Hàm xử lý smooth scroll khi click vào menu item
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false); // Đóng mobile menu sau khi click
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      } ${
        isScrolled
          ? "py-4 bg-white/95 dark:bg-dracula-background/95 backdrop-blur-md shadow-lg shadow-black/10"
          : "py-6 bg-white/80 dark:bg-dracula-background/80 backdrop-blur-sm"
      }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <motion.a
          href="#home"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-bold text-xl tracking-tight flex items-center gap-2 cursor-pointer text-gray-900 dark:text-dracula-foreground"
          onClick={(e) => handleNavClick(e, "#home")}>
          <Coffee className="text-orange-500 dark:text-orange-400" size={24} />
          <span>DuyLinh</span>
          <span className="text-orange-500 dark:text-orange-400">.java</span>
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-gray-500 dark:text-dracula-comment hover:text-gray-900 dark:hover:text-dracula-foreground transition-colors font-mono text-sm relative group">
              <span className="text-pink-500 dark:text-dracula-pink">.</span>
              {item.label.toLowerCase()}
              <span className="text-gray-500 dark:text-dracula-comment">()</span>
              {/* Underline effect on hover */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 dark:bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
              {/* Tooltip hiển thị ghi chú nếu có */}
              {item.note && (
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs rounded bg-gray-800 dark:bg-dracula-current text-white dark:text-dracula-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
                  {item.note}
                </span>
              )}
            </motion.a>
          ))}
        </nav>

        {/* Right side: Theme toggle + Mobile menu button */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-dracula-current hover:bg-gray-300 dark:hover:bg-dracula-comment transition-colors"
            title="Toggle Theme"
            aria-label="Toggle dark/light mode">
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-500 dark:text-dracula-yellow" />
            ) : (
              <Moon size={20} className="text-purple-600 dark:text-dracula-purple" />
            )}
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-dracula-current hover:bg-gray-300 dark:hover:bg-dracula-comment transition-colors"
            aria-label="Toggle menu">
            {isMenuOpen ? (
              <X size={20} className="text-gray-900 dark:text-dracula-foreground" />
            ) : (
              <Menu size={20} className="text-gray-900 dark:text-dracula-foreground" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <motion.nav
        initial={false}
        animate={isMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-gray-100/95 dark:bg-dracula-current/95 backdrop-blur-md">
        <div className="px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="block text-gray-500 dark:text-dracula-comment hover:text-gray-900 dark:hover:text-dracula-foreground transition-colors font-mono text-sm py-2">
              <span className="text-pink-500 dark:text-dracula-pink">.</span>
              {item.label.toLowerCase()}
              <span className="text-gray-500 dark:text-dracula-comment">()</span>
              {/* Hiển thị ghi chú trên mobile menu nếu có */}
              {item.note && (
                <span className="block text-xs text-gray-400 dark:text-dracula-comment/70 mt-0.5 pl-4">
                  → {item.note}
                </span>
              )}
            </a>
          ))}
        </div>
      </motion.nav>
    </header>
  );
};

export default Header;
